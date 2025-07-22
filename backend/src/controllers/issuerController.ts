// backend/src/controllers/issuerController.ts

import { Request, Response } from "express";
import * as issuerService from "./../services/issuerService";

export const registerIssuer = async (req: Request, res: Response) => {
  try {
    const issuer = await issuerService.registerIssuer(req.body);
    res.status(201).json(issuer);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginIssuer = async (req: Request, res: Response) => {
  try {
    const token = await issuerService.loginIssuer(req.body);
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const getAllIssuers = async (_req: Request, res: Response) => {
  const issuers = await issuerService.getAllIssuers();
  res.json(issuers);
};
