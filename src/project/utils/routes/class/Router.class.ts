import * as DOMPurify from "dompurify";

type RouteCallback = (
  errorElement?: HTMLElement,
  params?: Record<string, string>
) => void;

interface RouteConfig {
  path: string; // Specify the path for the route
  routeto?: string; // New property for redirection
  element?: RouteCallback; // The function to render this route
  errorElement?: RouteCallback; // Optional error element
  children?: RouteConfig[]; // Nested routes
  params?: Record<string, string>; // Params for the route
  index?: boolean; // New property to mark as the main child route
}

export class TSRouter {
  private routes: RouteConfig[] = [];
  private expectedParams?: Set<string>;

  constructor(routes: RouteConfig[], expectedParams: string[]) {
    this.routes = routes;
    this.expectedParams = new Set(expectedParams);
    window.addEventListener("popstate", this.handlePopState.bind(this));
    this.handlePopState(); // Initial handling of current state
  }

  private handlePopState() {
    const currentPath = window.location.pathname;
    const matchingRoute = this.findMatchingRoute(currentPath, this.routes);

    if (matchingRoute) {
      if (matchingRoute.routeto) {
        this.navigate(matchingRoute.routeto);
        return;
      }

      const errorElement = document.createElement("div");
      if (matchingRoute.element) {
        matchingRoute.element(
          errorElement,
          this.filterAndSanitizeParams(matchingRoute.params)
        ); // Filter and sanitize params
      }

      if (matchingRoute.children) {
        const nestedPath = currentPath.slice(matchingRoute.path.length);
        const childElement = errorElement.querySelector(
          "#child"
        ) as HTMLDivElement;
        if (childElement) {
          this.renderChildren(
            matchingRoute.children,
            nestedPath,
            childElement,
            this.filterAndSanitizeParams(matchingRoute.params!)
          ); // Filter and sanitize params
        }
      }
    } else {
      const notFoundRoute = this.findMatchingRoute("*", this.routes);
      if (notFoundRoute) {
        const errorElement = document.createElement("div");
        if (notFoundRoute.element) {
          notFoundRoute.element(
            errorElement,
            this.filterAndSanitizeParams(notFoundRoute.params)
          ); // Filter and sanitize params
        }
      }
    }
  }

  private renderChildren(
    children: RouteConfig[] | undefined,
    nestedPath: string,
    parentElement: HTMLElement,
    parentParams: Record<string, string>
  ) {
    if (!children || children.length === 0) {
      const childElement = parentElement.querySelector(
        "#child"
      ) as HTMLDivElement;
      if (childElement) {
        childElement.remove();
      }
      return;
    }

    // Check for an index child first
    const indexChild = children.find(child => child.index);

    // Check for a matching child route if no index child is found
    const matchingChild = this.findMatchingRoute(nestedPath, children);

    // Determine which child to render: index child or matching child
    const childToRender = indexChild || matchingChild;

    if (childToRender) {
      const childElement = document.createElement("div");
      childElement.id = "child";
      const mergedParams = { ...parentParams, ...childToRender.params };
      if (childToRender.element) {
        childToRender.element(
          childElement,
          this.filterAndSanitizeParams(mergedParams)
        ); // Filter and sanitize params
      }
      parentElement.appendChild(childElement);

      if (childToRender.children) {
        const nextNestedPath = nestedPath.slice(childToRender.path.length);
        this.renderChildren(
          childToRender.children,
          nextNestedPath,
          childElement,
          this.filterAndSanitizeParams(mergedParams)
        ); // Filter and sanitize params
      }
    }
  }

  private findMatchingRoute(
    path: string,
    routes: RouteConfig[]
  ): RouteConfig | undefined {
    for (const route of routes) {
      const routePath = route.path;
      const isDefaultRoute = routePath === "*";

      if (!isDefaultRoute) {
        const paramNames: string[] = [];
        const regexPattern = routePath.replace(/:[^\s/]+/g, match => {
          paramNames.push(match.substring(1));
          return "([^\\s/]+)";
        });

        const regex = new RegExp(`^${regexPattern}(?:/|$)`);
        const match = path.match(regex);

        if (match) {
          const params: Record<string, string> = {};
          paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
          });

          if (route.children) {
            const nestedPath = path.slice(match[0].length);
            const matchingChild = this.findMatchingRoute(
              nestedPath,
              route.children
            );
            if (matchingChild) {
              matchingChild.params = params;
              return matchingChild;
            }
          }

          return { ...route, params };
        }
      } else {
        return route;
      }
    }

    return undefined;
  }

  private filterAndSanitizeParams(
    params?: Record<string, string>
  ): Record<string, string> {
    if (!params) return {};
    const sanitizedParams: Record<string, string> = {};
    for (const key in params) {
      if (params.hasOwnProperty(key) && this.expectedParams!.has(key)) {
        sanitizedParams[key] = DOMPurify.sanitize(params[key]);
      }
    }
    return sanitizedParams;
  }

  navigate(path: string) {
    history.pushState(null, "", path);
    this.handlePopState();
  }

  addRoute(route: RouteConfig) {
    this.routes.push(route);
  }
}
