export interface Product {
  id: number;
  nome: string;
  modelo: string;
  furacao: string;
  cor: string;
  preco: number;
  imagem: string;
  carrosCompativeis: string[];
  aro: number;
  estoque: number;
  descricao?: string;
}

export interface ProductFilters {
  modelo?: string[];
  furacao?: string[];
  cor?: string[];
  carro?: string;
  precoMin?: number;
  precoMax?: number;
}

export interface ProductListParams extends ProductFilters {
  page?: number;
  perPage?: number;
}
