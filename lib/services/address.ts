import { AddressLookupResult } from "@/lib/types/address";

async function lookupViaCep(zipcode: string): Promise<AddressLookupResult | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${zipcode}/json/`);
    const data = await response.json();

    if (data.erro) return null;

    return {
      zipcode: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.estado, // Will be filled by state lookup
      stateCode: data.uf,
    };
  } catch (error) {
    console.error("Error looking up address via ViaCEP:", error);
    return null;
  }
}

async function lookupBrasilApi(zipcode: string): Promise<AddressLookupResult | null> {
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${zipcode}`);
    const data = await response.json();

    if (response.status !== 200) return null;

    return {
      zipcode: data.cep,
      street: data.street,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      stateCode: data.state,
    };
  } catch (error) {
    console.error("Error looking up address via Brasil API:", error);
    return null;
  }
}

export async function lookupAddress(zipcode: string): Promise<AddressLookupResult | null> {
  // Remove any non-numeric characters from zipcode
  const cleanZipcode = zipcode.replace(/\D/g, "");
  
  if (cleanZipcode.length !== 8) {
    throw new Error("CEP inválido");
  }

  // Try ViaCEP first
  const viaCepResult = await lookupViaCep(cleanZipcode);
  if (viaCepResult) return viaCepResult;

  // If ViaCEP fails, try Brasil API
  const brasilApiResult = await lookupBrasilApi(cleanZipcode);
  if (brasilApiResult) return brasilApiResult;

  throw new Error("CEP não encontrado");
}