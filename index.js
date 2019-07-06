const commander = require('commander');
const _ = require('lodash');
const fs = require('fs');

function isDefined(value){
  return value !== undefined && value !== null
}

function transform(config, options){
  if(options.resize){
    let dim = options.resize.split('x');
    let resizeOpts = {
      maxX: 24, //max graphs per row
      maxY: -1,
      h: dim[0] || 3,
      w: dim[1] || 3,
      perRow: 8
    }
    config =resize(config , resizeOpts);
  }

  if (isDefined(options.axis)){
    let axisOpts = {
      axis : options.axis
    };
    config = axis(config, axisOpts);
  }
  config.version += 1;
  return config;
}

function axis(config, opts){
  debugger
  let xshow = Number(opts.axis) ? true : false;
  let yshow = Number(opts.axis) ? true : false;
  let lshow = Number(opts.axis) ? true : false;
  config.panels.forEach(function(eachPanel, index){
    eachPanel.xaxis && (eachPanel.xaxis.show = xshow);
    eachPanel.yaxes && eachPanel.yaxes.forEach(function (eachY){
      eachY.show = yshow;
    });
    eachPanel.legend && (eachPanel.legend.show = lshow);
  });
  return config;
}

function resize(config, opts){
  debugger
  let lastX=0, lastY=0;
  config.panels.forEach(function(eachPanel, index){    
    eachPanel.gridPos.h = Math.floor(opts.h);
    eachPanel.gridPos.w = Math.floor(opts.w);
    eachPanel.gridPos.x = Math.floor((index % opts.perRow) * opts.w);
    eachPanel.gridPos.y = Math.floor(Math.floor(index / opts.perRow) * opts.h);
    if(eachPanel.maxPerRow){
      eachPanel.maxPerRow = opts.w;
    }
  });
  debugger
  return config;
}

(function(){
  if(require.main==module){
    commander
      .version('0.0.1')
      .option('-i, --infile <string>', 'infile', String)
      .option('-r, --resize in height and width HxW <string>', 'resize', String)
      .option('-a, --axis <value>', 'axis', Number)
      .parse(process.argv);
    let options={};
    ['infile', 'resize', 'axis'].forEach(function (eachArg){
      options[eachArg] = commander[eachArg];
    })
    let config = fs.readFileSync(options.infile);
    config = JSON.parse(config);
    transform(config, options);
    process.stdout.write(JSON.stringify(config,null,2));
  }
})();

