export interface AddressLookupResult {
  zipcode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  stateCode: string;
}

export interface AddressData {
  zipcode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  stateCode: string;
  number: string;
  complement?: string;
}

export interface AddressFormData {
  zipcode: string;
  number: string;
  complement?: string;
}