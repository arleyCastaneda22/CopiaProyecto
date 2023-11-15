import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Estilista } from 'src/app/interfaces/estilista.interfaces';
import { EstilistaService } from 'src/app/services/estilista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-estilista',
  templateUrl: './list-estilista.component.html',
  styleUrls: ['./list-estilista.component.css']
})
export class ListEstilistaComponent implements OnInit {
  //Para la paginación
  pages: number = 0;
  //Contiene los estilistas
  estilista: Estilista[] = []
  //Variable para buscar
  serach: string = ''

  subcripcion!: Subscription;

  estado:boolean=true;
  textoEstado:string='Activo'

  constructor(private servicioEstilista: EstilistaService, private fb: FormBuilder, private routes: Router) {

  }
  ngOnInit(): void {
    //Metódo para listar
    this.servicioEstilista.getEstilistas().subscribe(data => {
      console.log(this.estilista = data)
    });
    //Metódo para refrescar
    this.subcripcion = this.servicioEstilista.refresh.subscribe(() => {
      this.servicioEstilista.getEstilistas().subscribe(data => {
        console.log(this.estilista = data)
      });
    })


  }
  cambioEstado( index:number,id:string){
    this.estado=!this.estado
    if(this.estado){
      this.textoEstado='Activo'
    }else{
      this.textoEstado='Inactivo'
    }
    this.servicioEstilista.actulizarEstado(id).subscribe(res=>{
      console.log(res)
    })
  }


  //Metodo para eliminar
  eliminarEstilista(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioEstilista.EliminarEstilista(id).subscribe(res => {
          console.log("Se eliminó con exito")
        })
      }
    })

  }
  //Metodos para la páginacion
  nextPage() {
    this.pages += 7
  }
  //Metodos para la paginacion
  anteriorPage() {
    if (this.pages > 0) {
      this.pages -= 7

    }
  }

  buscarEstilista(nombre: string) {
    this.serach = nombre;
  }

}
