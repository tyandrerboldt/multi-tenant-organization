enum PropertyType {
  APARTMENT,
  COMMERCIAL,
  HOUSE,
  LAND,
  ROOM_RENT,
  SEASON_RENT,
}

enum Status {
  DRAFT,
  ACTIVE,
  INACTIVE,
  UNAVAILABLE,
}

enum HighlightStatus {
  NORMAL,
  FEATURED,
  MAIN,
}


// Interface genérica para cadastro de imóveis
interface RealEstateProperty {
  id: string;
  code: string;
  name: string;
  slug: string;
  type: PropertyType;
  status: Status;
  highlight: HighlightStatus;
  categoryId: number; // Relacionado a uma categoria pré-cadastrada
  description: string;
  address?: Address
  featuresIds: number[]; // Características específicas do imóvel
  images: string[]; // URLs das imagens do imóvel
}

interface Address {
  number: string;
  zipcode: string;
  streetId: number;
  cityId: number; // Relacionado a uma cidade pré-cadastrada
  stateId: number; // Relacionado a um estado pré-cadastrado
  neighborhoodId: number; // Relacionado a um bairro pré-cadastrado
  complement?: string;
};

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


enum OperationType {
  INSERT = "insert",
  UPDATE = "update"
}

enum AdType {
  SALE = "s",
  RENT = "u"
}

interface RealEstateAdConfig {
  id: string;
  operation: OperationType;
  subject: string; // Título do anúncio
  body: string; // Descrição do anúncio
  phone: number; // Contato do anunciante
  type: AdType; // "s" para venda, "u" para aluguel
  price: number; // Preço do imóvel
}