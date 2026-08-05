import { createRouter } from "@tanstack/react-router";
import { BookNotFound } from "@/components/book/NotFound";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: BookNotFound,
  });
}
