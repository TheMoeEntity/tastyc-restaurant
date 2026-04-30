export type Role =
  | "customer"
  | "staff"
  | "kitchen"
  | "manager"
  | "superadmin";

export interface User {
  name: string;
  email: string;
  role: Role;
}


export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type AuthResponse = {
  token: string;
  user: {
    role: string;
    name?: string;
    email?: string;
  };
};

export type UserRole =
  | "customer"
  | "staff"
  | "kitchen"
  | "manager"
  | "superadmin";

export type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[]; // optional role restriction
};


