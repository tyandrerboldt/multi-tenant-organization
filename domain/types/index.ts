// Interface genérica para cadastro de imóveis
interface RealEstateProperty {
  id: string;
  category: number; // Identificador da categoria do imóvel
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
  features: Record<string, any>; // Características específicas do imóvel
  images: string[]; // URLs das imagens do imóvel
}

// Apartamento
interface ApartmentProperty extends RealEstateProperty {
  features: {
    rooms: string;
    bathrooms: string;
    garage_spaces: string;
    size: string;
    apartment_type: string;
    apartment_features: string[];
    apartment_complex_features: string[];
  };
}

// Comércio e Indústria
interface CommercialProperty extends RealEstateProperty {
  features: {
    garage_spaces: string;
    size: string;
    commercial_type: string;
    commercial_features: string[];
  };
}

// Casa
interface HouseProperty extends RealEstateProperty {
  features: {
    rooms: string;
    bathrooms: string;
    garage_spaces: string;
    size: string;
    home_type: string;
    home_features: string[];
    home_complex_features: string[];
  };
}

// Terreno, Sítio e Fazenda
interface LandProperty extends RealEstateProperty {
  features: {
    size: string;
    re_land_type: string;
    re_land_features: string[];
  };
}

// Aluguel de Quartos
interface RoomRentProperty extends RealEstateProperty {
  features: {
    room_rent_features: string[];
  };
}

// Aluguel por Temporada
interface SeasonRentProperty extends RealEstateProperty {
  features: {
    rooms: string;
    bathrooms: string;
    garage_spaces: string;
    beds: string;
    size: string;
    rent_type: string;
    season_type: string;
    season_features: string[];
  };
}

// Union type para todas as categorias de imóveis
type RealEstatePropertyUnion =
  | ApartmentProperty
  | CommercialProperty
  | HouseProperty
  | LandProperty
  | RoomRentProperty
  | SeasonRentProperty;


// Interface genérica para configurações de anúncios
interface RealEstateAdConfig {
  id: string;
  operation: "insert" | "update";
  subject: string; // Título do anúncio
  body: string; // Descrição do anúncio
  phone: number; // Contato do anunciante
  type: "s" | "u"; // "s" para venda, "u" para aluguel
  price: number; // Preço do imóvel
}