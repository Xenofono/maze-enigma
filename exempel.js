const Measurement = {
  MILLILITER: 1,
  GRAM: 2,
  PIECE: 3,
  DECILITER: 4,
};
Object.freeze(Measurement);

class Ingredient {
  constructor(name, price, measurement, quantity) {
    this.name = name;
    this.price = price;
    this.measurement = measurement;
    this.quantity = quantity;
  }

  get adjustedPrice() {
    switch (this.measurement) {
      case Measurement.PIECE: {
        return this.price;
      }
      case Measurement.DECILITER: {
        return this.price / 100;
      }
      case Measurement.GRAM: {
        return this.price / 1000;
      }
      case Measurement.MILLILITER: {
        return this.price / 1000;
      }
    }
  }
}

const ingredients = new Map();

ingredients.set("ägg", new Ingredient("ägg", 2.5, Measurement.PIECE));
ingredients.set("bacon", new Ingredient("bacon", 5, Measurement.PIECE));
ingredients.set("mjölk", new Ingredient("mjölk", 10, Measurement.DECILITER));
ingredients.set("kött", new Ingredient("kött", 89.99, Measurement.GRAM));

class Recipe {
  constructor(ingredientsInRecipe) {
    this.ingredientsInRecipe = ingredientsInRecipe;
    this.ingredients = [];
    for (const [key, value] of Object.entries(ingredientsInRecipe)) {
      const ingredient = ingredients.get(key);
      if (ingredient) {
        const newIngredient = new Ingredient(
          ingredient.name,
          ingredient.price,
          ingredient.measurement,
          value
        );
        this.ingredients.push(newIngredient);
      }
    }
  }

  get totalPrice() {
    return this.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.adjustedPrice * ingredient.quantity,
      0
    );
  }

  recipePortions = (portions) => {
    const newRecipeObject = {};
    Object.entries(this.ingredientsInRecipe).forEach(
      ([key, value]) => (newRecipeObject[key] = value * portions)
    );
    return new Recipe(newRecipeObject);
  };
}

const recipe = new Recipe({ ägg: 2, bacon: 4 });
console.log(recipe);
console.log(recipe.totalPrice);

const recipe4People = recipe.recipePortions(4);
console.log(recipe4People);
console.log(recipe4People.totalPrice);

const milkMeatRecipe = new Recipe({ mjölk: 3, kött: 500 });
console.log(milkMeatRecipe);
console.log(milkMeatRecipe.totalPrice);

const milkMeatRecipe4People = milkMeatRecipe.recipePortions(4);
console.log(milkMeatRecipe4People);
console.log(milkMeatRecipe4People.totalPrice);
