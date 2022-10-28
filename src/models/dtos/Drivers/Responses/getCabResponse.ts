export class GetCabResponse {
  available_cabs: Array<AvailableCab>;
}

export class AvailableCab {
  name: string;
  phone_number: string;
  car_number: string;
}
