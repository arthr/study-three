/**
 * Sets up GUI for controlling environmental aspects
 */
export function setupEnvironmentGUI(gui, environmentManager) {
	// Folder for environmental controls
	const envFolder = gui.addFolder("Environment");

	// Time controls
	const timeFolder = envFolder.addFolder("Time");
	timeFolder
		.add(environmentManager.timeManager, "timeScale", 0.1, 100, 0.1)
		.name("Time Speed");

	// Celestial controls
	const celestialFolder = envFolder.addFolder("Celestial");
	const sunLight = environmentManager.lightingManager.getLight("sun");

	if (sunLight && typeof sunLight.getOrbitalTilt === "function") {
		celestialFolder
			.add({ tilt: sunLight.getOrbitalTilt() }, "tilt", 0, 45, 1)
			.name("Orbital Tilt (°)")
			.onChange((value) => {
				sunLight.setOrbitalTilt(value);
			});
	}

	// Weather effect controls
	const weatherFolder = envFolder.addFolder("Weather");
	const weatherSettings = {
		rain: false,
		fog: false,
		rainIntensity: 1000,
		fogDensity: 0.03,
	};

	weatherFolder
		.add(weatherSettings, "rain")
		.name("Rain")
		.onChange((value) => {
			if (value) {
				environmentManager.applyWeatherEffect("rain", {
					count: weatherSettings.rainIntensity,
				});
			} else {
				environmentManager.removeWeatherEffect("rain");
			}
		});

	weatherFolder
		.add(weatherSettings, "rainIntensity", 100, 5000, 100)
		.name("Rain Intensity")
		.onChange((value) => {
			if (weatherSettings.rain) {
				environmentManager.removeWeatherEffect("rain");
				environmentManager.applyWeatherEffect("rain", {
					count: value,
				});
			}
		});

	weatherFolder
		.add(weatherSettings, "fog")
		.name("Fog")
		.onChange((value) => {
			if (value) {
				environmentManager.applyWeatherEffect("fog", {
					density: weatherSettings.fogDensity,
				});
			} else {
				environmentManager.removeWeatherEffect("fog");
			}
		});

	weatherFolder
		.add(weatherSettings, "fogDensity", 0.01, 0.1, 0.01)
		.name("Fog Density")
		.onChange((value) => {
			if (weatherSettings.fog) {
				environmentManager.removeWeatherEffect("fog");
				environmentManager.applyWeatherEffect("fog", {
					density: value,
				});
			}
		});

	return envFolder;
}
