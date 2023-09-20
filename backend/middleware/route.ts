import { Request, Response, NextFunction } from "express";

export const frontendRouteController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  token = req.cookies.jwt;
  const userRole: string = req.cookies.role || "user";
  const verified: string = req.cookies.verified || "false";

  if ((req.path === "/auth/login" || req.path === "/auth/signup") && token) {
    return res.redirect("/");
  }

  if (req.path.startsWith("/admin") && userRole !== "admin") {
    return res.redirect("/auth/login");
  }

  if (req.path.startsWith("/seller") && userRole !== "vendor") {
    return res.redirect("/");
  }

  next();
};
