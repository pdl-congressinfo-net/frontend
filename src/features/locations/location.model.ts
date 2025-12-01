export interface Country {
  id: string;
  name: string;
  code2: string;
  code3: string;
  devco: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  countryId: string;
  locationTypeId: string;
}
