import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  iso3: { type: String },
  numeric_code: { type: String },
  iso2: { type: String },
  phonecode: { type: String },
  capital: { type: String },
  currency: { type: String },
  currency_name: { type: String },
  currency_symbol: { type: String },
  tld: { type: String },
  native: { type: String },
  region: { type: String },
  region_id: { type: String },
  subregion: { type: String },
  subregion_id: { type: String },
  nationality: { type: String },
  timezones: [
    {
      zoneName: { type: String },
      gmtOffset: { type: Number },
      gmtOffsetName: { type: String },
      abbreviation: { type: String },
      tzName: { type: String }
    }
  ],
  translations: {
    kr: { type: String },
    pt_BR: { type: String },
    pt: { type: String },
    nl: { type: String },
    hr: { type: String },
    fa: { type: String },
    de: { type: String },
    es: { type: String },
    fr: { type: String },
    ja: { type: String },
    it: { type: String },
    cn: { type: String },
    tr: { type: String }
  },
  latitude: { type: Number },
  longitude: { type: Number },
  emoji: { type: String },
  emojiU: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
  flag: { type: String },
  wikiDataId: { type: String }
},
 {
    timestamps: false,
    collection: "countries" //  force Atlas collection name
  }

);

const CountryModel = mongoose.model("Country", countrySchema);

export default CountryModel;
