import { db, initDatabase } from '../db/database';
import { runSeed } from '../seeds/seed';
import { calculateAggregatedNutrition } from '../utils/nutrition';
import { consolidateShoppingList } from '../utils/shopping';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';

async function testAll() {
  console.log('🧪 Iniciando batería de pruebas unitarias y de integración para MealCarta...');
  
  // 1. Database & Seed test
  initDatabase();
  runSeed();

  const recipeCount = (db.prepare('SELECT count(*) as count FROM recipes').get() as any).count;
  if (recipeCount >= 10) {
    console.log(`✅ [DB Test] Base de datos poblada correctamente con ${recipeCount} recetas.`);
  } else {
    throw new Error(`Fallo en prueba DB: solo hay ${recipeCount} recetas.`);
  }

  // 2. Nutrition aggregation test
  const testDishes = [
    { recipe_id: 1, servings: 2 }, // Asado
    { recipe_id: 2, servings: 2 }, // Ceviche
  ];
  const nutritionResult = calculateAggregatedNutrition(testDishes);
  if (nutritionResult.totals.calories > 0 && nutritionResult.percentagesRDA.calories > 0) {
    console.log(`✅ [Nutrition Engine] Cálculo acumulado exitoso: ${nutritionResult.totals.calories} kcal para ${testDishes.length} platos.`);
  } else {
    throw new Error('Fallo en cálculo de nutrición agregada');
  }

  // 3. Consolidated Shopping List test
  const shoppingResult = consolidateShoppingList(testDishes);
  if (shoppingResult.totalItems > 0 && Object.keys(shoppingResult.categories).length > 0) {
    console.log(`✅ [Shopping Engine] Consolidación exitosa: ${shoppingResult.totalItems} ingredientes agrupados en ${Object.keys(shoppingResult.categories).length} categorías de supermercado.`);
  } else {
    throw new Error('Fallo en consolidación de lista de compras');
  }

  // 4. Security & JWT test
  const password = 'SecretPassword2026!';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const isMatch = bcrypt.compareSync(password, hash);
  if (isMatch) {
    console.log('✅ [Security] Hasheo y verificación bcrypt funcional y seguro.');
  } else {
    throw new Error('Fallo en verificación de contraseñas bcrypt');
  }

  const token = generateToken({ id: 999, username: 'Tester', email: 'tester@mealcarta.org' });
  if (token && token.length > 20) {
    console.log('✅ [Security] Generación de tokens JWT operativa.');
  } else {
    throw new Error('Fallo en generación de token JWT');
  }

  console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
}

testAll().catch((err) => {
  console.error('❌ Error en las pruebas:', err);
  process.exit(1);
});
