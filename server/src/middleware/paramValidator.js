// This middleware is responsible for getting all the params from the request.
// Then it will check if the params are all valid.
// For example, if the request has a userId and a workspaceId, we need to check if the workspace belongs to the correct user.

const User = require("../models/User");
const Workspace = require("../models/Workspace");
const Space = require("../models/Space");
const ErrorResponse = require("../utils/errorResponse");

const userValidator = async function (req, res, next, value) {
  const userId = value;

  try {
    const user = await User.findById(userId);

    req.user = user;
  } catch (error) {
    return next(new ErrorResponse("User not found", 404));
  };
}

const workspaceValidator = async function (req, res, next, value) {
  const workspaceId = value;

  // First check if the user is allowed to access this workspace.
  if (!req.user.workspaces.includes(workspaceId)) {
    return next(new ErrorResponse("User not authorised to access this workspace", 403));
  }

  try {
    const workspace = await Workspace.findById(workspaceId);

    req.workspace = workspace;
  } catch (error) {
    return next(new ErrorResponse("Workspace not found", 404));
  };
}

const spaceValidator = async function (req, res, next) {
  const spaceId = value;

  // First check if the user is allowed to access this workspace.
  if (!req.workspace.spaces.includes(spaceId)) {
    return next(new ErrorResponse("User not authorised to access this space", 403));
  }

  try {
    const space = await Space.findById(spaceId);

    req.space = space;
  } catch (error) {
    return next(new ErrorResponse("Space not found", 404));
  };
}

exports.paramValidator = async function (req, res, next) {
  const { userId, workspaceId, spaceId } = req.params;
  console.log(userId, workspaceId, spaceId);

  if (userId && !req.user) {
    await userValidator(req, res, next, userId);
  }

  if (workspaceId && !req.workspace) {
    await workspaceValidator(req, res, next, workspaceId);
  }

  if (spaceId && !req.space) {
    await spaceValidator(req, res, next, spaceId);
  }


  next();
}
