import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Subscription, from } from 'rxjs';
import { Ventas } from 'src/app/interfaces/ventas.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { VentasService } from 'src/app/services/ventas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-ventas',
  templateUrl: './list-ventas.component.html',
  styleUrls: ['./list-ventas.component.css']
})
export class ListVentasComponent implements OnInit {

  pages: number = 0;

  // Contiene los usuarios
  dataSource = new MatTableDataSource<Ventas>();
  displayedColumns: string[] = [ 'clientes', 'servicios', 'precio', 'medio-pago', 'estado', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    // Variable para buscar
    search: string = '';

  modalSwith: boolean = false;
  ventas: Ventas[] = []
  subcripcion!: Subscription;

  constructor(private ventasService: VentasService) { }


  ngOnInit(): void {
    this.ventasService.getVentas().subscribe(data => {
      this.ventas = data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    //Metódo para refrescar
    this.subcripcion = this.ventasService.refresh.subscribe(() => {
      this.ventasService.getVentas().subscribe(data => {
        this.ventas = data;
        this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      });
    })
  }

  cambioEstado(id: string) {
    this.ventasService.actulizarEstado(id).subscribe(res => {
    })
  }

  eliminarVenta(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      iconColor: '#745af2',
      showCancelButton: true,
      confirmButtonColor: '#745af2',
      cancelButtonColor: '#745af2',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ventasService.EliminarVenta(id).subscribe(res => {

        })
      }
    })

  }

    // Métodos para la paginación
    nextPage() {
      this.pages += 7;
    }

    // Métodos para la paginación
    anteriorPage() {
      if (this.pages > 0) {
        this.pages -= 7;
      }
    }

    aplicarFiltro(valor: string): void {
      this.search = valor.trim().toLowerCase();
      this.dataSource.filter = valor;
    }

}



