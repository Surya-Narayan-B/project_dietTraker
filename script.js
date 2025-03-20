async function handleSubmit() {
    const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            height: 170,
            weight: 70,
            age: 25,
            gender: 'male',
            goal: 'maintain_weight'
        })
    });

    if (response.ok) {
        const nutrientData = await response.json();
        // Display nutrient data in an alert or add it to the HTML
        alert(`Protein: ${nutrientData.results.protein}g\nCarbs: ${nutrientData.results.carbs}g\nFat: ${nutrientData.results.fat}g\nCalories: ${nutrientData.results.calories} kcal`);
    } else {
        alert('Error: ' + response.statusText);
    }
}
