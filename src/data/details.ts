import { asset } from "../lib/asset";
export type Insert = { after: number; image: string; note: string };

export const MOMENTS: Record<string, string[]> = {
  "01": ["Кровь", "Я стою", "17 минут"],
  "02": ["Адаптация", "YU-7", "Юля"],
  "03": ["Элиас", "7 дней", "Трещины"],
  "04": ["YU-4", "Страх", "Кортизол"],
  "05": ["Приказ", "9,6 %", "Отказ"],
  "06": ["YU-9", "Оранжерея", "Перезагрузка"],
  "07": ["23 единицы", "Убирайся", "41 час"],
  "08": ["Порт", "4-9-1", "Тишина"],
  "09": ["Третий час", "Хлеб", "Булка и вода"],
  "10": ["Перекрёсток", "Не узнал", "Пахнет дождём"],
};

export const INSERTS: Record<string, Insert[]> = {
  "01": [
    {
      after: 0,
      image: asset("/book/images/d-01.jpg"),
      note: "Кровь на руках ещё тёплая.",
    },
  ],
  "02": [
    {
      after: 25,
      image: asset("/book/images/d-02.jpg"),
      note: "YU-7. Потом — Юля.",
    },
  ],
  "03": [
    {
      after: 7,
      image: asset("/book/images/d-03.jpg"),
      note: "Элиас… он умеет видеть трещины.",
    },
  ],
  "04": [
    {
      after: 11,
      image: asset("/book/images/d-04.jpg"),
      note: "Это страх.",
    },
  ],
  "05": [
    {
      after: 8,
      image: asset("/book/images/d-05.jpg"),
      note: "Ты можешь отказаться.",
    },
  ],
  "06": [
    {
      after: 36,
      image: asset("/book/images/d-06.jpg"),
      note: "Капли падают на лицо.",
    },
  ],
  "07": [
    {
      after: 19,
      image: asset("/book/images/d-07.jpg"),
      note: "Двадцать три единицы.",
    },
  ],
  "08": [
    {
      after: 5,
      image: asset("/book/images/d-08.jpg"),
      note: "Порт под левой лопаткой.",
    },
  ],
  "09": [
    {
      after: 15,
      image: asset("/book/images/d-09.jpg"),
      note: "Булка. И вода.",
    },
  ],
  "10": [
    {
      after: 7,
      image: asset("/book/images/d-10.jpg"),
      note: "Он проходит мимо в трёх метрах.",
    },
  ],
};
