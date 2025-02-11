"use client";

import { ChevronRight, Home, HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const translations: Record<string, string> = {
  account: "Conta",
  preferences: "Preferências",
  settings: "Configurações",
  billing: "Planos",
  roles: "Regras de Acesso",
  properties: "Imóveis",
  owners: "Proprietários",
  features: "Características",
  images: "Imagens",
  address: "Endereço",

  new: "Novo",
  edit: "Editar",
  "package-types": "Tipos de Pacote",
  "article-categories": "Categorias de Artigo",

  draft: "Rascunho",
  active: "Ativo",
  inactive: "Inativo",
};

function translatePathSegment(segment: string): string {
  // Primeiro, verifica se existe uma tradução direta
  if (translations[segment.toLowerCase()]) {
    return translations[segment.toLowerCase()];
  }

  // Se não houver tradução, formata o texto
  return segment
    .split("-")
    .map((word) => {
      const translation = translations[word.toLowerCase()];
      if (translation) return translation;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";

  paths.forEach((path) => {
    currentPath += `/${path}`;
    const label = translatePathSegment(path);

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {breadcrumbs.length > 1 &&
        breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            <Link
              href={breadcrumb.href}
              className={`hover:text-foreground transition-colors ${
                index === breadcrumbs.length - 1
                  ? "text-foreground font-medium"
                  : ""
              }`}
            >
              {breadcrumb.href == "/app" ? (
                <HomeIcon className="h-4 w-4" />
              ) : (
                breadcrumb.label
              )}
            </Link>
          </div>
        ))}
    </nav>
  );
}
