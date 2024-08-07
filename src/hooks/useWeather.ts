import axios from 'axios';
import { SearchType } from '../types';
// import { number, object, string, InferOutput, parse } from 'valibot';
import { z } from 'zod';
import { useMemo, useState } from 'react';
// import { Weather } from '../types/index';

// TYPE Guard o ASSERTION
/* 
function isWeatherResponse(weather: unknown): weather is Weather {
 return (
  Boolean(weather) &&
  typeof weather === 'object' &&
  typeof (weather as Weather).name === 'string' &&
  typeof (weather as Weather).main.temp === 'number' &&
  typeof (weather as Weather).main.temp_max === 'number' &&
  typeof (weather as Weather).main.temp_min === 'number'
  );
  } */

// ZOD
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});

export type Weather = z.infer<typeof Weather>;

// Valibot
/* const WeatherSchema = object({
  name: string(),
  main: object({
    temp: number(),
    temp_max: number(),
    temp_min: number(),
  }),
});

type Weather = InferOutput<typeof WeatherSchema>; */

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>({
    name: '',
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0,
    },
  });
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    const apiId = import.meta.env.VITE_API_KEY;
    setLoading(true);
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiId}`;

      const { data } = await axios(geoUrl);
      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiId}`;

      // Type Guards
      /* const { data: weatherResult } = await axios(weatherUrl);
      const result = isWeatherResponse(weatherResult);
      if (result) {
       console.log(weatherResult.name);
       } */

      // ZOD
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      if (result.success) {
        setWeather(result.data);
      } else {
        console.log('respuesta mal formada');
      }

      /* // Valibot
      const { data: weatherResult } = await axios(weatherUrl);
      const result = parse(WeatherSchema, weatherResult);
      if (result) {
        console.log(result.name);
      } else {
        console.error('respuesta mal formada');
      } */
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);
  return { loading, hasWeatherData, weather, fetchWeather };
}
