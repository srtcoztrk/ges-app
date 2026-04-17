# GES Dashboard — Güneş Enerji Santrali Mart Ayı Analizi

Next.js + Recharts ile geliştirilmiş interaktif GES üretim dashboard'u.

## Özellikler

- Gün bazlı saatlik veriş/çekiş çubuk grafiği
- Grafik ve tablo görünümü arasında geçiş
- Günlük özet istatistikler (toplam, pik saatler)
- Mart ayı genel bakış grafiği
- Türkçe sayı formatlaması

## Kurulum

### Gereksinimler
- Node.js 18+

### Adımlar

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

### Yayına Alma (Production)

```bash
npm run build
npm start
```

## Proje Yapısı

```
src/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Ana sayfa (server component)
│   └── globals.css       # Global stiller
├── components/
│   └── GESDashboard.tsx  # Ana dashboard bileşeni
└── data/
    └── ges_data.json     # Mart ayı saatlik veriler (31 gün × 24 saat)
```

## Veri Yapısı

`ges_data.json` formatı:

```json
{
  "1": {
    "00-01": { "veris": 0.0, "cekis": 559.46 },
    "01-02": { "veris": 0.0, "cekis": 543.68 },
    ...
  },
  ...
}
```
