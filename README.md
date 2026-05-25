# SPK UAS Mastery — Next.js

Website belajar UAS Sistem Pendukung Keputusan untuk materi **SAW, SMART, TOPSIS, dan AHP**.

## Isi Website

- Ringkasan materi lebih lengkap: definisi, tahapan, rumus, jebakan teori, dan kaitan praktikum.
- Perbandingan cepat empat metode.
- Bank **60 soal menengah–sulit**: 45 teori dan 15 hitungan singkat.
- Mode **Simulasi CBT 50 soal** sesuai kisi-kisi UAS.
- Filter materi, tipe soal, tingkat kesulitan, serta pencarian.
- Pembahasan jawaban dan skor otomatis.

## Data JSON

Seluruh materi dan soal dipisahkan dari UI agar gampang diedit:

```text
data/
├── materials.json   # Materi, kisi-kisi, tabel perbandingan, sumber
└── questions.json   # 60 soal, opsi, kunci, pembahasan
```

Tidak ada asset gambar atau database besar, sehingga source project tetap ringan.

## Struktur Utama

```text
spk-uas-nextjs-v2/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── data/
│   ├── materials.json
│   └── questions.json
├── lib/
│   └── types.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build Produksi

```bash
npm run build
npm run start
```

## Deploy Vercel

Upload folder project ke GitHub lalu import repository pada Vercel. Jangan upload folder `node_modules`.
