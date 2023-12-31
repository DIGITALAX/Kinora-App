import { ItemType } from "@/components/Common/types/common.types";

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const BASE_URL: string = "https://api-v2-mumbai-live.lens.dev";
export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;

export const KINORA_OPEN_ACTION: `0x${string}` =
  "0x69257Ea75D2Cb2193E805FB8d31F4240B6cBba05";
export const CHROMADIN_ID: string = "0x01c6a9";
export const LENS_HUB_PROXY_ADDRESS_MATIC: `0x${string}` =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
export const LENS_HUB_PROXY_ADDRESS_MUMBAI: `0x${string}` =
  "0x4fbffF20302F3326B20052ab9C217C44F6480900";
export const NFT_CREATOR: `0x${string}` =
  "0x0147435c505390Bb1E657c8EBc373DcEdfDe0F08";
export const NFT_CREATOR_MUMBAI: `0x${string}` =
  "0x5B714F8eb491453f9cb9D5c4Ba698b34E9b8c0f0";
export const KINORA_ESCROW_CONTRACT: `0x${string}` =
  "0x32Dd59AE48B38C4Af8dE119Aee734dd25b82F477";

export const COVER_CONSTANTS: string[] = [
  "QmPW4zahvfhNUUbc27sM2WZE9uQcZ9KYGcXTq64zzuoazi",
  "QmUMXvUKwGNBZttnZ8jq6Fp1qPQ12exABUjFx87iuZtzmn",
  "QmYRBVVmpTssQfX9xAANqHKf2S7CGURe2WJL7dmW2srkRy",
  "Qmd6VhQwisMsm3rysntGUCu3SDWnAvC5sfPCh6MaeqYuAf",
  "QmbuV5vN2AQxPeUxGnyVxLtkrvpTnrAAFoA5pUiQAkCxFm",
  "QmfKVFqvDWhdTQkM7QAf3etSG2bDU3BMLcDB1rfeqr9rTa",
  "QmWRPEUXg3niko4yc4v9bndbW946mdt1gHTzbTr12Q5TZ6",
  "QmWF2rPYcJJQQbq9cCS2Vgzs1ZWRsakF1Rk5tbDP1wbU2u",
];

export const HASHTAG_CONSTANTS: string[] = [
  "AI",
  "public domain",
  "cc0",
  "cypherpunk",
  "solarpunk",
  "lofi",
  "bedroom punk",
  "crypto",
  "Autonomy",
  "retrofuturism",
  "cybernetics",
  "bio punk",
  "digital art",
  "urban exploration",
  "ambient",
  "sustainable",
  "augmented",
  "fashion",
  "abstract expressionism",
  "street photography",
  "minimalist landscapes",
  "digital surrealism",
  "contemporary sculpture",
  "vintage fashion",
  "ceramic artistry",
  "urban graffiti",
  "fantasy illustration",
  "retro pop culture",
  "artisan crafts",
  "eco-friendly designs",
  "watercolor botanicals",
  "avant-garde film",
  "jazz age posters",
  "psychedelic patterns",
  "geometric tattoos",
  "steampunk inventions",
  "gothic architecture",
  "conceptual installations",
  "Abstract",
  "Bohemian",
  "Cyberpunk",
  "Deco",
  "Ethereal",
  "Futurism",
  "Graffiti",
  "neo",
  "Holographic",
  "Impressionist",
  "Juxtaposed",
  "Kinetic",
  "Luminous",
  "Minimalist",
  "Neon",
  "Organic",
  "Pixel",
  "Quirky",
  "Retro",
  "Surreal",
  "Textured",
];

export const PRINT_NFT: `0x${string}` =
  "0x3D92B16Bb20A740C5dDcaEda305A7c16B2DdC580";

export const ACCEPTED_TOKENS: string[][] = [
  [
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
    "WMATIC",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  ],
  [
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
    "WETH",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  ],
  [
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
    "USDT",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  ],
  [
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
    "MONA",
    "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
  ],
];

export const ACCEPTED_TOKENS_MUMBAI: string[][] = [
  [
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
    "WMATIC",
    "0x3cf7283c025d82390e86d2feb96eda32a393036b",
  ],
  [
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
    "WETH",
    "0x566d63f1cc7f45bfc9b2bdc785ffcc6f858f0997",
  ],
  [
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
    "MONA",
    "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30",
  ],
  [
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
    "USDT",
    "0x07b722856369f6b923e1f276abca58dd3d15243d",
  ],
];

export const numberToItemTypeMap: { [key: number]: ItemType } = {
  0: ItemType.CoinOp,
  1: ItemType.Chromadin,
  2: ItemType.Legend,
  3: ItemType.Listener,
  4: ItemType.F3M,
  5: ItemType.Other,
};
