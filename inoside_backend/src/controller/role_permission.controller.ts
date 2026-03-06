import { Request, Response } from "express";
import { RolePermission } from "../models/rolePermission.model";
import { Role } from "../models/role.model";
import { Permission } from "../models/permission.model";

// ----------------------------
// Assign a permission to a role
// ----------------------------
export const assignPermissionToRole = async (req: Request, res: Response) => {
  try {
    const { roleId, permissionId } = req.body;

    if (!roleId || !permissionId) {
      return res
        .status(400)
        .json({ message: "roleId and permissionId required" });
    }

    // Check if role and permission exist
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);

    if (!role || !permission) {
      return res.status(404).json({ message: "Role or Permission not found" });
    }

    // Check if already assigned
    const existing = await RolePermission.findOne({
      where: { roleId, permissionId },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Permission already assigned to role" });
    }

    const rp = await RolePermission.create({ roleId, permissionId });
    return res
      .status(201)
      .json({ message: "Permission assigned", rolePermissionId: rp.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Remove permission from role
// ----------------------------
export const removePermissionFromRole = async (req: Request, res: Response) => {
  try {
    const { roleId, permissionId } = req.body;

    if (!roleId || !permissionId) {
      return res
        .status(400)
        .json({ message: "roleId and permissionId required" });
    }

    const deleted = await RolePermission.destroy({
      where: { roleId, permissionId },
    });

    if (!deleted)
      return res.status(404).json({ message: "RolePermission not found" });

    return res.status(200).json({ message: "Permission removed from role" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// List all permissions for a role
// ----------------------------
export const listPermissionsForRole = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    const role = await Role.findByPk(roleId, {
      include: [{ model: Permission, through: { attributes: [] } }],
    });

    if (!role) return res.status(404).json({ message: "Role not found" });

    return res
      .status(200)
      .json({ role: role.roleName, permissions: role.permissions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// List all role-permissions
// ----------------------------
export const listAllRolePermissions = async (_req: Request, res: Response) => {
  try {
    const rolePermissions = await RolePermission.findAll({
      include: ["role", "permission"],
    });
    return res.status(200).json(rolePermissions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Update a role-permission mapping (rare, e.g., change permission)
// ----------------------------
export const updateRolePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId, permissionId } = req.body;

    const rp = await RolePermission.findByPk(id);
    if (!rp)
      return res.status(404).json({ message: "RolePermission not found" });

    if (roleId) rp.roleId = roleId;
    if (permissionId) rp.permissionId = permissionId;

    await rp.save();

    return res
      .status(200)
      .json({ message: "RolePermission updated", rolePermission: rp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
