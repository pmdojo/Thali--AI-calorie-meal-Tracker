-- Seeded from packages/shared/data/dishes.v1.json.
-- Regenerate with: `npm run seed:dishes` (see packages/shared/scripts/emit-sql.ts — TODO).
-- Idempotent: uses ON CONFLICT so re-runs update in place.

insert into public.dish_reference
  (id, name, category, vegetarian, portion_grams, kcal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, version)
values
  ('roti',           'Roti (whole wheat)',        'grain',   true,  '{"small":30,"medium":45,"large":60}',   297, 11.0, 56.0, 3.7, 1),
  ('chapati_ghee',   'Chapati with ghee',         'grain',   true,  '{"small":35,"medium":50,"large":65}',   340, 10.5, 55.0, 8.5, 1),
  ('paratha_plain',  'Plain paratha',             'grain',   true,  '{"small":60,"medium":90,"large":120}',  320, 7.5,  45.0, 12.0, 1),
  ('paratha_aloo',   'Aloo paratha',              'grain',   true,  '{"small":90,"medium":130,"large":170}', 300, 6.5,  42.0, 11.5, 1),
  ('naan',           'Naan',                       'grain',   true,  '{"small":80,"medium":110,"large":150}', 310, 9.0,  55.0, 6.0, 1),
  ('rice_white',     'White rice (cooked)',       'rice',    true,  '{"small":100,"medium":150,"large":220}',130, 2.7,  28.2, 0.3, 1),
  ('rice_basmati',   'Basmati rice (cooked)',     'rice',    true,  '{"small":100,"medium":150,"large":220}',121, 3.5,  25.2, 0.4, 1),
  ('jeera_rice',     'Jeera rice',                'rice',    true,  '{"small":120,"medium":170,"large":240}',155, 3.2,  27.0, 3.5, 1),
  ('biryani_veg',    'Vegetable biryani',         'rice',    true,  '{"small":150,"medium":220,"large":300}',175, 4.0,  26.0, 6.5, 1),
  ('biryani_chicken','Chicken biryani',           'rice',    false, '{"small":180,"medium":250,"large":330}',205, 10.0, 22.0, 8.5, 1),
  ('dal_tadka',      'Dal tadka',                 'legume',  true,  '{"small":100,"medium":150,"large":200}',115, 6.0,  12.0, 4.5, 1),
  ('dal_makhani',    'Dal makhani',               'legume',  true,  '{"small":100,"medium":150,"large":200}',175, 7.0,  13.0, 10.5, 1),
  ('chana_masala',   'Chana masala',              'legume',  true,  '{"small":100,"medium":150,"large":200}',140, 7.5,  20.0, 3.5, 1),
  ('rajma',          'Rajma',                     'legume',  true,  '{"small":100,"medium":150,"large":200}',130, 8.0,  20.0, 2.5, 1),
  ('sambar',         'Sambar',                    'legume',  true,  '{"small":120,"medium":180,"large":240}',65,  3.5,  10.0, 1.5, 1),
  ('paneer_butter',  'Paneer butter masala',      'protein', true,  '{"small":100,"medium":150,"large":200}',265, 11.0, 10.0, 21.0, 1),
  ('paneer_bhurji',  'Paneer bhurji',             'protein', true,  '{"small":100,"medium":150,"large":200}',195, 14.0, 6.0,  13.0, 1),
  ('palak_paneer',   'Palak paneer',              'protein', true,  '{"small":100,"medium":150,"large":200}',180, 10.0, 7.0,  13.0, 1),
  ('chicken_curry',  'Chicken curry',             'protein', false, '{"small":120,"medium":180,"large":240}',185, 15.0, 6.0,  11.5, 1),
  ('butter_chicken', 'Butter chicken',            'protein', false, '{"small":120,"medium":180,"large":240}',240, 14.0, 7.0,  17.5, 1),
  ('egg_bhurji',     'Egg bhurji',                'protein', false, '{"small":80,"medium":120,"large":160}', 195, 12.0, 3.0,  15.0, 1),
  ('aloo_gobi',      'Aloo gobi',                 'sabzi',   true,  '{"small":100,"medium":150,"large":200}',110, 3.0,  13.0, 5.5, 1),
  ('bhindi_masala',  'Bhindi masala',             'sabzi',   true,  '{"small":100,"medium":150,"large":200}',105, 2.5,  10.0, 6.5, 1),
  ('baingan_bharta', 'Baingan bharta',            'sabzi',   true,  '{"small":100,"medium":150,"large":200}',95,  2.0,  8.0,  6.5, 1),
  ('mixed_veg',      'Mixed vegetable sabzi',     'sabzi',   true,  '{"small":100,"medium":150,"large":200}',100, 3.0,  11.0, 5.0, 1),
  ('kachumber',      'Kachumber salad',           'salad',   true,  '{"small":60,"medium":100,"large":140}',  30, 1.2,  5.5,  0.3, 1),
  ('raita',          'Cucumber raita',            'drink',   true,  '{"small":80,"medium":120,"large":180}',  60, 3.0,  5.0,  3.0, 1),
  ('curd',           'Plain curd',                'drink',   true,  '{"small":80,"medium":120,"large":180}',  60, 3.3,  4.8,  3.0, 1),
  ('samosa',         'Samosa',                    'snack',   true,  '{"small":50,"medium":90,"large":130}',  300, 5.0,  32.0, 17.0, 1),
  ('pakora',         'Onion pakora',              'snack',   true,  '{"small":60,"medium":100,"large":140}', 315, 7.0,  30.0, 18.0, 1),
  ('idli',           'Idli',                       'grain',   true,  '{"small":60,"medium":90,"large":130}',  155, 4.5,  32.0, 0.5, 1),
  ('dosa_plain',     'Plain dosa',                 'grain',   true,  '{"small":90,"medium":130,"large":180}', 170, 4.0,  30.0, 4.0, 1),
  ('dosa_masala',    'Masala dosa',                'grain',   true,  '{"small":150,"medium":220,"large":300}',185, 4.5,  30.0, 5.5, 1),
  ('upma',           'Upma',                       'grain',   true,  '{"small":120,"medium":180,"large":240}',130, 3.0,  22.0, 3.5, 1),
  ('poha',           'Poha',                       'grain',   true,  '{"small":120,"medium":180,"large":240}',130, 2.5,  24.0, 2.5, 1),
  ('gulab_jamun',    'Gulab jamun (1 pc)',         'sweet',   true,  '{"small":35,"medium":55,"large":80}',   385, 4.0,  55.0, 16.0, 1)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  vegetarian = excluded.vegetarian,
  portion_grams = excluded.portion_grams,
  kcal_per_100g = excluded.kcal_per_100g,
  protein_per_100g = excluded.protein_per_100g,
  carbs_per_100g = excluded.carbs_per_100g,
  fat_per_100g = excluded.fat_per_100g,
  version = excluded.version,
  updated_at = now();
