ServerEvents.recipes((e) => {
  let makeID = (type, output, input) => {
    return _makeID('mekanism', type, output, input);
  };

  let enrich = (output, input) => {
    e.recipes.mekanism.enriching(output, input).id(makeID('enriching', output, input));
  };

  let metallurgic_infusing = (output, input, chem, perTick) => {
    e.recipes.mekanism.metallurgic_infusing(output, input, chem, perTick ? perTick : false).id(makeID('metallurgic_infusing', output, input));
  };

  let crush = (output, input) => {
    e.recipes.mekanism.crushing(output, input).id(makeID('crushing', output, input));
  };

  let injecting = (output, input, chem) => {
    e.recipes.mekanism.injecting(output, input, chem, false).id(makeID('injecting', output, input));
  };

  let crystallizing = (output, input) => {
    e.recipes.mekanism.crystallizing(output, input).id(makeID('crystallizing', output, input));
  };

  let chem_infuser = (output, chemLeft, chemRight) => {
    e.recipes.mekanism.chemical_infusing(output, chemLeft, chemRight).id(makeID('chemical_infusing', output, chemLeft));
  };

  let reaction = (item_out, item_in, fluid_in, chem_out, chem_in, duration) => {
    let recipe = {
      type: 'mekanism:reaction',
      item_input: {
        type: 'neoforge:compound',
        children: [],
        count: item_in[1],
      },
      item_output: Item.of(item_out).toJson(),
      fluid_input: {},
      chemical_input: {},
      chemical_output: {},
      duration: duration,
    };

    item_in[0].forEach((item) => {
      recipe.item_input.children.push(Ingredient.of(item).toJson());
    });

    if (fluid_in.split(' ')[1].includes('#')) recipe.fluid_input.tag = fluid_in.split(' ')[1].replace('#', '');
    else recipe.fluid_input.id = fluid_in.split(' ')[1];
    recipe.fluid_input.amount = parseInt(fluid_in.split(' ')[0].replace('x', ''));

    if (chem_in.split(' ')[1].includes('#')) recipe.chemical_input.chemical = chem_in.split(' ')[1].replace('#', '');
    else recipe.chemical_input.id = chem_in.split(' ')[1];
    recipe.chemical_input.amount = parseInt(chem_in.split(' ')[0].replace('x', ''));

    recipe.chemical_output.id = chem_out.split(' ')[1];
    recipe.chemical_output.amount = parseInt(chem_out.split(' ')[0].replace('x', ''));

    e.custom(recipe).id(makeID('reaction', item_out, item_in[0][0]));
  };

  let rotary = (chem, fluid) => {
    let recipe = {
      type: 'mekanism:rotary',
      chemical_input: {
        amount: 1,
        chemical: chem,
      },
      chemical_output: {
        amount: 1,
        id: chem,
      },
      fluid_input: {
        amount: 1,
        tag: `c:${fluid.split(':')[1]}`,
      },
      fluid_output: {
        amount: 1,
        id: fluid,
      },
    };

    e.custom(recipe).id(makeID('rotary', chem, fluid));
  };

  let oxidizing = (output, input) => {
    let recipe = {
      type: 'mekanism:oxidizing',
      input: Ingredient.of(input).toJson(),
      output: {
        amount: parseInt(output.split('x ')[0]),
        id: output.split('x ')[1],
      },
    };
    e.custom(recipe).id(makeID('oxidizing', output, input));
  };

  // QoL Recipes
  metallurgic_infusing('4x mekanism:dust_refined_obsidian', 'minecraft:obsidian', '40x mekanism:diamond');
  metallurgic_infusing('9x mekanism:alloy_infused', '#c:storage_blocks/copper', '90x mekanism:redstone');
  metallurgic_infusing('9x mekanism:basic_control_circuit', '#c:storage_blocks/osmium', '180x mekanism:redstone');

  // MI Compat
  enrich('2x modern_industrialization:lignite_coal', '#c:ores/lignite_coal');
  crush('modern_industrialization:lignite_coal_dust', '#c:gems/lignite_coal');
  crush('modern_industrialization:brick_dust', 'minecraft:brick');
  crush('4x modern_industrialization:brick_dust', 'minecraft:bricks');
  enrich('6x modern_industrialization:salt_dust', '#c:ores/salt');
  enrich('2x modern_industrialization:antimony_dust', '#c:ores/antimony');
  // Made Monazite/Bauxite be less efficient through Mekanism, as you *should* be using MI's machines for them, but adding them here for convenience.
  enrich('4x modern_industrialization:monazite_dust', '#c:ores/monazite');
  enrich('4x modern_industrialization:bauxite_dust', '#c:ores/bauxite');

  // New Stuff
  rotary('mekanism:antimatter', 'craftoria:antimatter');
  oxidizing('200x craftoria:plutonium_oxide', '#c:ingots/plutonium');
  chem_infuser('400x mekanism:uranium_hexafluoride', '200x mekanism:hydrofluoric_acid', '1x craftoria:plutonium_oxide');
});
//860,400 mb burned per min
//100,00 mb per ingot, 8.6 ingots per min
//1 ingot every 7 seconds
