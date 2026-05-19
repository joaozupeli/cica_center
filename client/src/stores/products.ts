import { defineStore } from "pinia";
import api from "@/services/api";
import type { Product, ProductListParams } from "@/types/product";
import type { PaginatedResponse } from "@/types/api";

const USE_MOCK = !import.meta.env.VITE_API_URL;

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    nome: "Roda Krmai R55 Aro 17",
    modelo: "Krmai R55",
    furacao: "5x100",
    cor: "preto",
    preco: 1890,
    imagem:
      "https://images.unsplash.com/photo-1618764283656-4f2562385a19?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Volkswagen Gol", "Volkswagen Polo", "Volkswagen Voyage"],
    aro: 17,
    estoque: 12,
    descricao:
      "Roda esportiva com design agressivo, acabamento preto fosco e excelente acabamento.",
  },
  {
    id: 2,
    nome: "Roda BBS LM Aro 18",
    modelo: "BBS LM",
    furacao: "5x114",
    cor: "prata",
    preco: 3490,
    imagem:
      "https://images.unsplash.com/photo-1578682169493-97be94d670be?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Honda Civic", "Toyota Corolla", "Nissan Sentra"],
    aro: 18,
    estoque: 6,
    descricao:
      "Réplica BBS LM com acabamento prata polido, leveza e visual clássico.",
  },
  {
    id: 3,
    nome: "Roda Volk Racing TE37 Aro 17",
    modelo: "Volk TE37",
    furacao: "5x100",
    cor: "preto",
    preco: 2390,
    imagem:
      "https://images.unsplash.com/photo-1657650067496-fe55ca98f802?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Subaru Impreza", "Volkswagen Gol", "Ford Fiesta"],
    aro: 17,
    estoque: 8,
    descricao: "Inspirada na lendária Volk TE37, leveza e visual JDM.",
  },
  {
    id: 4,
    nome: "Roda Konig Hypergram Aro 18",
    modelo: "Konig Hypergram",
    furacao: "5x114",
    cor: "bronze",
    preco: 2890,
    imagem:
      "https://images.unsplash.com/photo-1752560923593-836995b183d4?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Honda Civic", "Subaru WRX", "Hyundai HB20"],
    aro: 18,
    estoque: 4,
    descricao: "Estilo Time Attack, acabamento bronze fosco e visual de pista.",
  },
  {
    id: 5,
    nome: "Roda Enkei RPF1 Aro 17",
    modelo: "Enkei RPF1",
    furacao: "4x100",
    cor: "prata",
    preco: 2190,
    imagem:
      "https://images.unsplash.com/photo-1608479746923-7e17632a9799?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Honda Fit", "Ford Ka", "Volkswagen Up"],
    aro: 17,
    estoque: 10,
    descricao: "Clássica Enkei RPF1, leveza e visual esportivo.",
  },
  {
    id: 6,
    nome: "Roda Rotiform LAS-R Aro 19",
    modelo: "Rotiform LAS-R",
    furacao: "5x112",
    cor: "preto",
    preco: 4290,
    imagem:
      "https://images.unsplash.com/photo-1768341396286-a6322d588111?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Audi A3", "Volkswagen Jetta", "Volkswagen Golf"],
    aro: 19,
    estoque: 3,
    descricao: "Roda concava com acabamento preto fosco, visual stance premium.",
  },
  {
    id: 7,
    nome: "Roda OZ Ultraleggera Aro 17",
    modelo: "OZ Ultraleggera",
    furacao: "5x100",
    cor: "branco",
    preco: 2790,
    imagem:
      "https://images.unsplash.com/photo-1761942943505-f134f851e88e?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Volkswagen Polo", "Volkswagen Gol", "Fiat Punto"],
    aro: 17,
    estoque: 7,
    descricao: "Leveza extrema, design racing italiano.",
  },
  {
    id: 8,
    nome: "Roda Work Emotion CR Kiwami Aro 18",
    modelo: "Work Emotion CR",
    furacao: "5x114",
    cor: "preto",
    preco: 3690,
    imagem:
      "https://images.unsplash.com/photo-1760510926243-ad1da20f31e2?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Nissan 350Z", "Honda S2000", "Toyota Corolla"],
    aro: 18,
    estoque: 5,
    descricao: "Visual JDM agressivo, ideal para projetos stance.",
  },
  {
    id: 9,
    nome: "Roda Rays Gram Lights 57DR Aro 17",
    modelo: "Gram Lights 57DR",
    furacao: "4x100",
    cor: "bronze",
    preco: 2590,
    imagem:
      "https://images.unsplash.com/photo-1757528495083-a877a0629464?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Honda Civic", "Mazda MX-5", "Ford Ka"],
    aro: 17,
    estoque: 9,
    descricao: "Acabamento bronze fosco, clássico do mundo time attack.",
  },
  {
    id: 10,
    nome: "Roda HRE P101 Aro 19",
    modelo: "HRE P101",
    furacao: "5x112",
    cor: "prata",
    preco: 5990,
    imagem:
      "https://images.unsplash.com/photo-1726262842192-a54836151247?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["BMW Série 3", "Audi A4", "Mercedes-Benz Classe C"],
    aro: 19,
    estoque: 2,
    descricao: "Roda forjada premium, acabamento prata polido.",
  },
  {
    id: 11,
    nome: "Roda Advan RG-D2 Aro 18",
    modelo: "Advan RG-D2",
    furacao: "5x100",
    cor: "preto",
    preco: 3190,
    imagem:
      "https://images.unsplash.com/photo-1751601396877-8094d72b6ccf?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Subaru BRZ", "Toyota 86", "Volkswagen Golf"],
    aro: 18,
    estoque: 6,
    descricao: "Design Advan tradicional, leveza e performance.",
  },
  {
    id: 12,
    nome: "Roda Vossen HF-2 Aro 19",
    modelo: "Vossen HF-2",
    furacao: "5x114",
    cor: "preto",
    preco: 4790,
    imagem:
      "https://images.unsplash.com/photo-1768862670980-7be7cf0c66c8?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Honda Civic", "Toyota Camry", "Nissan Maxima"],
    aro: 19,
    estoque: 4,
    descricao: "Roda flow form com visual premium, acabamento preto fosco.",
  },
  {
    id: 13,
    nome: "Roda Method Racing MR502 Aro 17",
    modelo: "Method MR502",
    furacao: "5x114",
    cor: "bronze",
    preco: 2990,
    imagem:
      "https://images.unsplash.com/photo-1759189206849-4ee5cebcd756?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Ford Ranger", "Toyota Hilux", "Chevrolet S10"],
    aro: 17,
    estoque: 8,
    descricao: "Roda off-road com visual aventureiro, acabamento bronze.",
  },
  {
    id: 14,
    nome: "Roda Sparco Pista Aro 17",
    modelo: "Sparco Pista",
    furacao: "4x100",
    cor: "branco",
    preco: 1990,
    imagem:
      "https://images.unsplash.com/photo-1756862040980-8a4846bb864d?w=800&auto=format&fit=crop&q=80",
    carrosCompativeis: ["Fiat Uno", "Volkswagen Gol", "Ford Ka"],
    aro: 17,
    estoque: 11,
    descricao: "Visual racing italiano, acabamento branco com aro polido.",
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(products: Product[], params: ProductListParams): Product[] {
  let result = [...products];

  if (params.modelo && params.modelo.length > 0) {
    const aros = params.modelo.map((m) => m.toLowerCase());
    result = result.filter((p) => {
      const aro = `aro${p.aro}`;
      return aros.includes(aro) || aros.includes(p.modelo.toLowerCase());
    });
  }

  if (params.furacao && params.furacao.length > 0) {
    result = result.filter((p) => params.furacao!.includes(p.furacao));
  }

  if (params.cor && params.cor.length > 0) {
    result = result.filter((p) => params.cor!.includes(p.cor));
  }

  if (params.carro && params.carro.trim() !== "") {
    const termo = params.carro.toLowerCase();
    result = result.filter((p) =>
      p.nome.toLowerCase().includes(termo) ||
      p.modelo.toLowerCase().includes(termo) ||
      p.cor.toLowerCase().includes(termo) ||
      p.furacao.toLowerCase().includes(termo) ||
      `aro ${p.aro}`.includes(termo) ||
      `aro${p.aro}`.includes(termo) ||
      p.carrosCompativeis.some((c) => c.toLowerCase().includes(termo))
    );
  }

  if (typeof params.precoMin === "number") {
    result = result.filter((p) => p.preco >= params.precoMin!);
  }
  if (typeof params.precoMax === "number") {
    result = result.filter((p) => p.preco <= params.precoMax!);
  }

  return result;
}

async function mockList(
  params: ProductListParams
): Promise<PaginatedResponse<Product>> {
  await delay(250);
  const page = params.page && params.page > 0 ? params.page : 1;
  const perPage = params.perPage && params.perPage > 0 ? params.perPage : 24;
  const filtered = applyFilters(MOCK_PRODUCTS, params);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);
  return { data, total, page, perPage, totalPages };
}

interface ProductsState {
  list: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  current: Product | null;
}

export const useProductsStore = defineStore("products", {
  state: (): ProductsState => ({
    list: [],
    total: 0,
    page: 1,
    perPage: 24,
    totalPages: 1,
    loading: false,
    error: null,
    current: null,
  }),

  getters: {
    coresDisponiveis: () =>
      Array.from(new Set(MOCK_PRODUCTS.map((p) => p.cor))).sort(),

    furacoesDisponiveis: () =>
      Array.from(new Set(MOCK_PRODUCTS.map((p) => p.furacao))).sort(),

    arosDisponiveis: () =>
      Array.from(new Set(MOCK_PRODUCTS.map((p) => p.aro))).sort((a, b) => a - b),

    precoMaximo: () =>
      Math.max(...MOCK_PRODUCTS.map((p) => p.preco), 0),
  },

  actions: {
    async fetchList(params: ProductListParams = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = USE_MOCK
          ? await mockList(params)
          : (await api.get<PaginatedResponse<Product>>("/products", { params }))
              .data;
        this.list = response.data;
        this.total = response.total;
        this.page = response.page;
        this.perPage = response.perPage;
        this.totalPages = response.totalPages;
      } catch (err) {
        this.error = "Não foi possível carregar os produtos.";
        this.list = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        if (USE_MOCK) {
          await delay(150);
          const found = MOCK_PRODUCTS.find((p) => p.id === id) || null;
          this.current = found;
          if (!found) this.error = "Produto não encontrado.";
        } else {
          const { data } = await api.get<Product>(`/products/${id}`);
          this.current = data;
        }
      } catch (err) {
        this.error = "Não foi possível carregar o produto.";
        this.current = null;
      } finally {
        this.loading = false;
      }
    },
  },
});
