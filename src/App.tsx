import styles from './App.module.css';
import Form from './components/Form/Form';
import useWeather from './hooks/useWeather';
import WeatherDetail from './components/WeatherDetail/WeatherDetail';
import Spinner from './components/Spinner/Spinner.tsx';

function App() {
  const { weather, loading, fetchWeather, hasWeatherData } = useWeather();
  return (
    <>
      <h1 className={styles.title}>HOla</h1>
      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />
        {loading && <Spinner />}
        {hasWeatherData && <WeatherDetail weather={weather}></WeatherDetail>}
      </div>
    </>
  );
}

export default App;
