/**
 * External dependencies.
 */
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Internal dependencies.
 */
import { WorkspaceContext } from "./contexts";
import { CATEGORY_MAP, isSectionOf, sectionsFor } from "@/constants";
import { CATEGORY_IDS } from "@/types";
import type { CategoryId } from "@/types";

const isCategory = (value: string | null): value is CategoryId =>
  value !== null && (CATEGORY_IDS as readonly string[]).includes(value);

/**
 * Holds "where am I in the editor", mirrored into the URL so a workspace can
 * be linked and restored on reload.
 */
export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const category: CategoryId = isCategory(categoryParam)
    ? categoryParam
    : CATEGORY_IDS[0];

  const sectionParam = searchParams.get("section");
  const section =
    sectionParam && isSectionOf(category, sectionParam)
      ? sectionParam
      : sectionsFor(category)[0].id;

  const setCategory = useCallback(
    (next: CategoryId) => {
      setSearchParams(
        (params) => {
          const current = params.get("section");
          params.set("category", next);
          // Keep the section when the new category has one by the same name
          // (`apps` and `appearance` exist everywhere), otherwise start over.
          params.set(
            "section",
            current && isSectionOf(next, current)
              ? current
              : CATEGORY_MAP[next].sections[0].id
          );
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSection = useCallback(
    (next: string) => {
      setSearchParams(
        (params) => {
          params.set("section", next);
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const value = useMemo(
    () => ({ category, section, setCategory, setSection }),
    [category, section, setCategory, setSection]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
