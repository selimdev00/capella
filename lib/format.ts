import type { User } from "@/lib/types";

export function fullName(user: Pick<User, "firstName" | "lastName">): string {
  return `${user.firstName} ${user.lastName}`;
}

export function initials(user: Pick<User, "firstName" | "lastName">): string {
  return `${user.firstName.at(0) ?? ""}${user.lastName.at(0) ?? ""}`.toUpperCase();
}

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Show only the last 4 digits of a card number. */
export function maskCard(cardNumber: string): string {
  const last4 = cardNumber.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function mapsUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;
}
