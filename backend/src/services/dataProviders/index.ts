import { DataProvider } from './base';
import { YahooFinanceProvider } from './yahooFinance';
import { CoinGeckoProvider } from './coinGecko';
import { ExchangeRateProvider } from './exchangeRate';
import { AlphaVantageProvider } from './alphaVantage';
import { MockProvider } from './mock';

export function createDataProviders(): DataProvider[] {
  const providers: DataProvider[] = [];

  // Use mock provider in development if API keys are not configured
  if (process.env.NODE_ENV === 'development' && !process.env.ALPHA_VANTAGE_API_KEY) {
    providers.push(new MockProvider());
    return providers;
  }

  // Add real providers
  providers.push(
    new YahooFinanceProvider(),
    new CoinGeckoProvider()
    // ExchangeRateProviderは削除（Yahoo Financeで代替）
  );

  // Add Alpha Vantage if API key is provided
  if (process.env.ALPHA_VANTAGE_API_KEY) {
    providers.push(new AlphaVantageProvider());
  }

  // Fallback to mock provider for any missing data
  providers.push(new MockProvider());

  return providers;
}

export { DataProvider };