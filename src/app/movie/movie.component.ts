import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../database.service";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  actorsDB: any[]=[];
  moviesDB: any[] = [];

  section = 5;

  title: string = "";
  year: number = 0;
  movieId: string = "";
  actors = [];

  deleteBefore: number = 0;
  actorSelect: string = "";
  movieSelect: string = "";

  constructor(private dbService: DatabaseService) {}

  //Get all Actors
  onGetMovies() {
    this.dbService.getMovies().subscribe((data: any[]) => {
      this.moviesDB = data;
    });
  }
  //Create a new Actor, POST request
  onSaveMovie() {
    let obj = { title: this.title, year: this.year };
    this.dbService.createMovie(obj).subscribe(result => {
      this.onGetMovies();
    });
  }
  //Delete Movie
  onDeleteMovie(item) {
    this.dbService.deleteMovie(item._id).subscribe(result => {
      this.onGetMovies();
    });
  }

  onDeleteMovieByYear() {
    this.moviesDB.forEach(movie=>{
      if(movie.year<this.deleteBefore) this.dbService.deleteMovie(movie._id).subscribe(result => {
        this.onGetMovies();
       });
    }); 
    this.onGetMovies();
  }

  // This lifecycle callback function will be invoked with the component get initialized by Angular.
  ngOnInit() {
    this.onGetMovies();
  }

  changeSection(sectionId) {
    // change section!! 
    // only section with this id will be shown 
    this.section = sectionId;
    this.resetValues();
    if(sectionId == "9"){
      this.dbService.getActors().subscribe((data: any[]) => {
        this.actorsDB = data;
      });
    }
  }

  resetValues() {
    this.title = "";
    this.year = 0;
    this.movieId = "";
  }
  onActorSelected(actor){
    this.actorSelect = actor._id;
    console.log(actor._id);
  }
  
  onMovieSelected(movie){
    this.movieSelect = movie._id;
    console.log(movie._id);
  }
  onAddActorToMovie(){
    let obj = {id: this.actorSelect}
    this.dbService.addActorToMovie(this.movieSelect,obj).subscribe(result => {
      this.onGetMovies();
    });
  }
}