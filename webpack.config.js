// Plugin che ci permette di utilizzare un template nel codice sorgente e ottimizzarlo per la versione che andrà online
const HtmlWebpackPlugin = require("html-webpack-plugin")
// Libreria che ci permette di utilizzare le Environment Variables durante lo sviluppo locale
const Dotenv = require('dotenv-webpack')
// Modulo di NodeJS che dà la possibilità di interagire con file e cartelle locali
const path = require('path')

// Per permettere a WebPack di utilizzare gli argomenti il modulo deve essere una funzione (normalmente è un oggetto)
module.exports = (env, argv) => {
  // FONDAMENTALE! Definiamo il file da utilizzare in base all'ambiente
  // Se WebPack vede che siamo in sviluppo andrà ad utilizzare './src/index_dev.js'
  // Se invece saremo in produzione utilizzerà './src/index.js'
  const entryPath = argv.mode === 'development' ? './src/index_dev.js' : './src/index.js'
  return {
    entry: {
      // Qui specifichiamo il file di ENTRATA, vedi commento sopra
      main: path.resolve(__dirname, entryPath),
    },
    output: {
      // Una volta creato un pacchetto WebPack metterà i file risultanti nella cartella build
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'build')
    },
    // Configurazione di un plugin, necessario per sveltire il processo di sviluppo vedi asterischi nello snippet successivo **
    devServer: {
      contentBase: './build',
      open: true
    },
    plugins: [
      // Plugin che prende un template e lo personalizza, completandolo con scripts ed eventuali stili
      new HtmlWebpackPlugin({
        title: "Pollution Forecast",
        template: path.resolve(__dirname, './src/index.html'),
      }),
      // Qui dotenv-webpack viene inizializzato
      new Dotenv()
    ]
  }
};