import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Address } from "../models/address.model";
import { Role } from "../models/role.model";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES_IN = "1d";

// ----------------------------
// Get current user profile
// ----------------------------
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as User; // attached by auth middleware
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const fullUser = await User.findByPk(user.id, {
      include: ["role", { model: Address, as: "primaryAddress" }],
    });

    return res.status(200).json(fullUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Update user details
// ----------------------------
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as User;
    const { full_name, phone, password, address } = req.body;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (password) user.password_hash = await bcrypt.hash(password, 10);

    await user.save();

    // Update primary address if provided
    if (address) {
      if (user.primary_address_id) {
        await Address.update(address, {
          where: { id: user.primary_address_id },
        });
      } else {
        const addr = await Address.create({
          ...address,
          entity_type: "users",
          entity_id: user.id,
          is_primary: true,
        });
        user.primary_address_id = addr.id;
        await user.save();
      }
    }

    return res.status(200).json({ message: "User updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// List all users (Admin only)
// ----------------------------
export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      include: ["role", { model: Address, as: "primaryAddress" }],
    });
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Delete user (Admin only)
// ----------------------------
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
