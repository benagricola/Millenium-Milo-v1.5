/**
 * Millenium Machines Milo v1.5 Postprocessor for Fusion360.
 * 
 * This postprocessor assumes that most complex functionality like
 * tool changes and work coordinate setting is handled in the machine firmware.
 * 
 * As such, it is a very simple post-processor and only supports 3 axis, one spindle,
 * and arcs on X and Y axes.
 * 
 * This postprocessor assumes that your firmware supports the following gcodes:
 *   - G37: Probe tool length
 *     - This can be automated using a toolsetter or
 *     - Guide the user through a manual measurement process
 *   - G6000: Probe rectangular cuboid work piece dimensions and set co-ordinate system zero
 *     - This can also be automated using a 3d touch probe or
 *     - can guide the user through a manual process by jogging the tool.
 * 
 */

// Set display configuration of Postprocessor as displayed in Fusion360
description = "Milo v1.5 Post Processor";
longDescription = "Millenium Machines Milo v1.5 Post Processor.";
vendor = "Millenium Machines";
vendorUrl = "https://www.millenniummachines.com/";
legal = "Copyright (C) 2012-2018 by Autodesk, Inc. 2022-2023 Millenium Machines";

// Postprocessor engine settings
certificationLevel = 2;
minimumRevision = 24000;

// Output file format settings
extension = "gcode";
setCodePage("ascii");

// Machine capabilities
capabilities = CAPABILITY_MILLING;
tolerance    = spatial(0.002, MM);

// Postprocessor settings specific to machine capabilities
minimumChordLength    = spatial(0.1, MM);  // Minimum delta movement when interpolating circular moves
minimumCircularRadius = spatial(0.1, MM);  // Minimum radius of circular moves that can be interpolated
maximumCircularRadius = spatial(1000, MM); // Maximum radius of circular moves that can be interpolated
minimumCircularSweep  = toRad(0.1);        // Minimum angular sweep of circular moves
maximumCircularSweep  = toRad(90);         // Maximum angular sweep of circular moves, set to 90 as we use Radius output for arcs

allowHelicalMoves     = true;              // Output helical moves as arcs
allowSpiralMoves      = false;             // Linearize spirals (circular moves with a different starting and ending radius)
allowedCircularPlanes = undefined;         // Allow arcs on all planes

// Property groups for user-configurable properties
groupDefinitions = {
  general: {
    title: "General",
    description: "General output configuration",
    collapsed: true,
    order: 10
  },
  setup: {
    title: "Machine Setup",
    description: "Machine setup configuration",
    collapsed: false,
    order: 20
  },
  op: {
    title: "Operation Setup",
    description: "Operation setup configuration",
    collapsed: false,
    order: 30
  }
};

// Properties configurable by the user when configuring the post-processor
properties = {
  outputMachine:   { 
    title: "Output machine details",
    description: "Output machine settings header.",
    group: "general",
    value: true,
    type: "boolean"
  },
  outputTools:     { 
    title: "Output tools",
    description: "Output tool list header.",
    group: "general",
    value: true,
    type: "boolean"
  },
  outputVersion:   {
    title: "Output version details",
    description: "Output version details header.",
    group: "general",
    value: true,
    type: "boolean"
  },
  homeBeforeStart: {
    title: "Home before start",
    description: "When enabled, machine will home in X, Y and Z directions prior to executing any operations.",
    group: "setup",
    value: true,
    scope: "machine",
    type: "boolean"
  },
  probeWorkPieceBeforeStart: {
    title: "Probe workpiece before start",
    description: "When enabled, machine will execute G6000 to probe a cuboid work piece prior to executing any operations.",
    group: "setup",
    value: true,
    scope: "machine",
    type: "boolean",
  },
  homeBeforeOp: {
    title: "Home before operation",
    description: "When enabled, machine will home in X, Y and Z directions prior to the current operation.",
    group: "op",
    value: true,
    scope: "operation",
    type: "boolean"
  },
  probeWorkPieceBeforeOp: {
    title: "Probe workpiece before operation",
    description: "When enabled, machine will execute G6000 to probe a cuboid work piece prior to executing the current operation.",
    group: "op",
    value: true,
    scope: "operation",
    type: "boolean",
  }
};

// Configure command formatting functions
var gFmt = createFormat({ prefix: "G", decimals: 1 }); // Create formatting command for G codes
var mFmt = createFormat({ prefix: "M", decimals: 0 }); // Create formatting command for M codes
var tFmt = createFormat({ prefix: "T", decimals: 0 }); // Create formatting command for T (tool) codes


// Create formatting output for X, Y and Z axes. Use 3 d.p. for milimeters and 4 for anything else.
// Format radiuses in the same way
var axesFmt   = createFormat({ decimals: (unit == MM ? 3 : 4), type: FORMAT_REAL });
var radiusFmt = axesFmt;

// Create formatting output for spindle RPM, integer only
var rpmFmt = createFormat({ type: FORMAT_INTEGER });

// Create formatting output for seconds, used for delays, integer only.
var secFmt = createFormat({ type: FORMAT_INTEGER });

// Force output of G, M and T commands when executed
var gCmd = createOutputVariable({ control: CONTROL_FORCE }, gFmt );
var mCmd = createOutputVariable({ control: CONTROL_FORCE }, mFmt );
var tCmd = createOutputVariable({ control: CONTROL_FORCE }, tFmt );

// Output X, Y and Z variables when set
var xVar = createOutputVariable({ prefix: "X" }, axesFmt);
var yVar = createOutputVariable({ prefix: "Y" }, axesFmt);
var zVar = createOutputVariable({ prefix: "Z" }, axesFmt); // TODO: Investigate safe retracts using parking location

// Output I, J and K variables when they're non-zero
var iVar = createOutputVariable({ prefix: "I", control: CONTROL_NONZERO }, axesFmt);
var jVar = createOutputVariable({ prefix: "J", control: CONTROL_NONZERO }, axesFmt);
var kVar = createOutputVariable({ prefix: "K", control: CONTROL_NONZERO }, axesFmt);

// Output RPM whenever set, as we may need to start spindle back up after a tool change.
var sVar = createOutputVariable({ prefix: "S", control: CONTROL_FORCE }, rpmFmt);

// Create modal groups
var gCodes = createModalGroup(
  // Only allow the following gcodes to be outputted (we restrict
  // output to gcodes we know are safe).
  { strict: true, force: false }, 
  [
      [0, 1, 2, 3],       // Motion codes
      [17, 18, 19],       // Plane codes
      [90, 91, 93, 94],   // Positioning and feed codes
      [27, 28, 37, 6000]  // Other codes (park, home, probe tool length, probe work piece)
  ],
  gFmt);


// Track current WCS setting
var wcsIndex = 0;

var safeText = /[^0-9a-z\.,=_\-]/gi;

// Standard functions for outputting RRF (NIST) compatible gcode

// Allow alphanumeric comments with safe punctuation.
function writeComment(text) {
  var comment = text.replace(safeText, "");
  writeln(`(${comment})`);
}

// Write formatted gcode block
function writeBlock() {
  var text = formatWords(arguments);
  if(!text) {
    return
  }
  writeWords(text);
}

// Function onComment. Called for manual NC comment commands
function onComment(text) {
  writeComment(text);
}

function writeRRFModal(title, text, mode=2) {
  var safeText  = text.replace(safeText, "");
  var safeTitle = title.replace(safeText, "");

  writeBlock(`${mFmt.format(291)} P"${safeText}" R"${safeTitle} S${mode}`);

  return;
}

// Function onOpen. Called at start of each CAM operation
function onOpen() {
  // We don't allow this to be configurable as it makes gcode files
  // impossible to read.
  setWordSeparator(" ");

  // Output program name and comment at start of file
  if (programName) {
    writeComment(programName);
  }
  if (programComment) {
    writeComment(programComment);
  }

  writeComment(`Program exported at ${(new Date()).toLocaleDateString()}`);
  writeln("");

  // Output version details if enabled
  if (properties.outputVersion) {
    if (typeof getHeaderVersion === "function") {
      writeComment(`Post-processor version: ${getHeaderVersion()}`);
    }
    if (typeof getHeaderDate === "function") {
      writeComment(`Post-processor last modified: ${getHeaderDate()}`);
    }
    writeln("");
  }

  // Output machine details if enabled
  if (properties.outputMachine) {
    writeComment("Machine Details");
    writeComment(` Vendor: ${machineConfiguration.getVendor()}`);
    writeComment(` Model: ${machineConfiguration.getModel()}`);
    writeComment(` Description: ${machineConfiguration.getDescription()}`);
    writeComment(` Width: ${machineConfiguration.getWidth()} Depth: ${machineConfiguration.getDepth()} Height: ${machineConfiguration.getHeight()}`);
    writeln("");
  }

  // Output tool details if enabled and tools are configured
  var tools  = getToolTable();
  var nTools = tools.getNumberOfTools()
  if (properties.outputTools && nTools > 0) {
    writeComment("Tool Details");
    for(var i = 0; i < nTools; i++) {
      var tool = tools.getTool(i);
      writeComment(`${tFmt.format(tool.number)} D=${axesFmt.format(tool.diameter)} CR=${axesFmt.format(tool.cornerRadius)} - ${getToolTypeName(tool.type)}`);
    }
  }

  // Don't allow use of WCS 0 (machine co-ordinates in RRF) as this probably
  // means no WCS Zero point is set and we'll end up crashing into things.
  if(getNumberOfSections() > 0 && getSection(0).workOffset === 0) {
    error("Please use a non-zero work offset. Using machine co-ordinates is generally bad practice and increases the possibility of mill-breaking issues.");
  }

  // Prompt user to manually check machine before proceeding
  writeRRFModal("Safety First!", "Make sure the machine and work-piece are secure, the spindle is in a safe spot and proceed with caution. Safety squints are NOT ADEQUATE!");

  // Now we get to the actual gcode. Everything below this configures the machine
  // prior to starting to parse sections

  writeBlock(gCodes.format(90)); // Set machine to absolute movement mode

  // Make sure any movements use the correct unit.
  // Our machine macros will be implemented using millimeters regardless of
  // what mode is set here.
  switch (unit) {
    case MM:
      writeBlock(gCodes.format(21));
      break;
    case IN:
      writeBlock(gCodes.format(20));
      break;
  }

  // Home before starting any operations if requested
  if(properties.homeBeforeStart) {
    writeBlock(gcodes.Format(28));
  }

  // Probe cuboid workpiece before starting any operations if requested
  if(properties.probeWorkPieceBeforeStart) {
    writeBlock(gcodes.Format(6000));
  }
}