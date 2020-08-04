import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { xml } from 'd3';

@Component({
  selector: 'app-vertical-tree',
  templateUrl: './vertical-tree.component.html',
  styleUrls: ['./vertical-tree.component.css']
})
export class VerticalTreeComponent implements OnInit, OnChanges {
  @Output() getNodeData: EventEmitter<any> = new EventEmitter();
  @Input('data') data;
  @Input('width') width;
  @Input('height') height;
  @Input('nodeClick') nodeClick;
  @Input('search') search;
  //@Input('animate') animate;
  d3: d3.TreeLayout<any>;
  duration:number = 0;
  i: number = 0;
  searchText = this.search;
  L = 56;
  
  constructor() {    
  }

  iter(nodeData) {    
    if(nodeData['name'].length > this.L/10 + 4){
      //console.log(this.L)
      this.L +=5;
    }
    for (var i = 0; i < nodeData.children.length; i++) {
       this.iter(nodeData.children[i]);
    }
  }

  ngOnInit() {
    this.L=55;
    this.iter(this.data);

    let draw = (source) => {      
      let margin = {top: 20, right: 20, bottom: 30, left: 20};
      let width = this.width - margin.left - margin.right;
      let height = this.height - margin.top - margin.bottom;

      let treemap = d3.tree().size([width, height]);
      let treeData = treemap(root);
      let nodes = treeData.descendants();
      let links = treeData.descendants().slice(1);
  
      nodes.forEach(d => d.y = d.depth * 100);
      
      let node = g.selectAll('g.node')
        .data(nodes, d => d['id'] || (d['id'] = ++this.i));
  
      let nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr("style", "cursor: pointer")
        .attr("transform", d => "translate(" + source.x0 + "," + source.y0 + ")")
        .on('click',(d)=> {
          //draw(this.nodeClick(d));
          //draw(this.getNodeData.emit(d.data));
          //console.log(d["data"]);
          draw(this.getNodeData.emit(d["data"]));
          //draw(function(_){this.getNodeData.emit(_)}(d["data"]));
        });
      
      let L = this.L;

      nodeEnter.append('rect')
        .attr('class', 'node')
        .attr('width', L)
        .attr('height', L)
        .attr('rx', d => d.children? 5 : L*0.5)
        .attr('ry', d => d.children? 5 : L*0.5)
        .attr('fill', d =>  d['data']['color'])
        .attr("x", -1*L*0.5)
        .attr("y",-1*L*0.5)
        
      
      nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("style", "font: 15px sans-serif")
        .attr("x", 0)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d =>  d.data['name'] );
        
    
      let nodeUpdate = nodeEnter.merge(<any>node);
      
      nodeUpdate.transition()
        .duration(this.duration)
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

      nodeUpdate.select('rect')
        .attr('width', L)
        .attr('height', L)
        .attr("fill", d =>  d.data["found"] == true ? "black" : d.data["status"] == 2 ? "#dca45a" : (d.data["gender"] == 1 ? "#5eb5bc":"#80b86f"))
    
      let nodeExit = node.exit().transition()
        .duration(this.duration)
        .attr("transform",d => "translate(" + source.x + "," + source.y + ")")
        .remove();
      
      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6)
        
      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);
        
      // Let's draw links
      let link = g.selectAll('path.link')
        .data(links, d=> d['id']);
      
      // Work on enter links, draw straight lines
      
      let linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr('d', () =>{
          let o = {x: source.x0, y: source.y0};
          return diagonal(o, o)
        });
      
      // UPDATE
      let linkUpdate = linkEnter.merge(<any>link);
      
      // Transition back to the parent element position, now draw a link from node to it's parent
      linkUpdate.transition()
          .duration(this.duration)
          .attr('d', d =>diagonal(d, d.parent));

      // Remove any exiting links
      let linkExit = link.exit().transition()
          .duration(this.duration)
          .attr('d', d => {
            let o = {x: source.x, y: source.y}
            return diagonal(o, o)
          })
          .remove();
      
      // Store the old positions for transition.
      nodes.forEach(function(d){
        d['x0'] = d.x;
        d['y0'] = d.y;
      });
  
    }

    let zoom = () => {
      g.attr('transform', d3.event.transform);
    }
    
    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    let zoomListener = d3.zoom().scaleExtent([0.001, 1000]).on("zoom", zoom); 
    
    //Khaled if you are reading...this was my solution to the crazy link lines :)
    let diagonal = (s, d) => {
      return "M" + s.x + "," + s.y
        + "C" + s.x + "," + (s.y + d.y) / 2
        + " " + d.x + "," +  (s.y + d.y) / 2
        + " " + d.x + "," + d.y;
    }
    
    let margin = {top: 20, right: 20, bottom: 30, left: 20};
    let width = this.width - margin.left - margin.right + 400;
    let height = this.height - margin.top - margin.bottom;
    

    let svg = d3.select("#container")
      .append("div")
      .classed("svg-container", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 -10 "+this.width+" "+this.height+"")
      //class to make it responsive
      .classed("svg-content-responsive", true)
      .call(zoomListener);

    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
    let root;
    root = this.data;
    root.isRoot = true;
    root = d3.hierarchy(root);
    root.x0 = 0;
    root.y0 = width / 3;
    draw(root);

    //this.zoom();
  }

  ngOnChanges(){
    this.searchText = this.search;
    document.querySelector("div.svg-container").remove();
    this.ngOnInit();
  }

}
