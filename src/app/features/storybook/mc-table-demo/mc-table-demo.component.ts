import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MCTable, MCTdTemplateDirective } from '@mckit/table';
import { MCColumn, MCListResponse } from '@mckit/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

@Component({
  selector: 'app-mc-table-demo',
  standalone: true,
  imports: [
    CommonModule,
    MCTable,
    MCTdTemplateDirective,
    ButtonModule,
    TagModule,
    CardModule,
    TooltipModule,
  ],
  template: `
    <div class="storybook-container">
      <div class="storybook-header">
        <h1><i class="pi pi-table"></i> MC-Table Documentation</h1>
        <p>Guía completa con ejemplos de uso del componente MC-Table de MC-Kit</p>
      </div>

      <!-- Ejemplo 1: Tabla Simple -->
      <section class="example-section">
        <h2>1. Tabla Simple (Sin Templates)</h2>
        <p class="description">
          La forma más básica de usar MC-Table. Los datos se muestran directamente sin formato personalizado.
        </p>
        
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <h3>Ejemplo en Vivo</h3>
            </div>
          </ng-template>
          
          <mc-table 
            [columns]="simpleColumns" 
            [response]="usersResponse()">
          </mc-table>
        </p-card>

        <div class="code-section">
          <h4>Código TypeScript</h4>
          <pre><code class="language-typescript">{{simpleTableCode}}</code></pre>
          
          <h4>Código HTML</h4>
          <pre><code class="language-html">{{simpleTableTemplate}}</code></pre>
        </div>
      </section>

      <!-- Ejemplo 2: Tabla con Templates Personalizados -->
      <section class="example-section">
        <h2>2. Tabla con Templates Personalizados</h2>
        <p class="description">
          Usa <code>mcTdTemplate</code> para personalizar cómo se muestran las celdas. 
          Puedes agregar iconos, estilos, componentes de PrimeNG, etc.
        </p>
        
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <h3>Ejemplo en Vivo</h3>
            </div>
          </ng-template>
          
          <mc-table 
            [columns]="customColumns" 
            [response]="usersResponse()">
            
            <!-- Template para email con icono -->
            <ng-template mcTdTemplate="email" let-user>
              <i class="pi pi-envelope mr-2"></i>
              <a [href]="'mailto:' + user.email">{{ user.email }}</a>
            </ng-template>

            <!-- Template para rol con badge -->
            <ng-template mcTdTemplate="role" let-user>
              <p-tag 
                [value]="user.role" 
                [severity]="getRoleSeverity(user.role)">
              </p-tag>
            </ng-template>

            <!-- Template para estado con badge -->
            <ng-template mcTdTemplate="status" let-user>
              <p-tag 
                [value]="getStatusLabel(user.status)" 
                [severity]="getStatusSeverity(user.status)">
              </p-tag>
            </ng-template>
          </mc-table>
        </p-card>

        <div class="code-section">
          <h4>Código TypeScript</h4>
          <pre><code class="language-typescript">{{customTableCode}}</code></pre>
          
          <h4>Código HTML</h4>
          <pre><code class="language-html">{{customTableTemplate}}</code></pre>
        </div>
      </section>

      <!-- Ejemplo 3: Tabla con Acciones -->
      <section class="example-section">
        <h2>3. Tabla con Columna de Acciones</h2>
        <p class="description">
          Agrega botones de acción para cada fila. Útil para editar, eliminar, ver detalles, etc.
        </p>
        
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <h3>Ejemplo en Vivo</h3>
            </div>
          </ng-template>
          
          <mc-table 
            [columns]="actionsColumns" 
            [response]="usersResponse()">
            
            <ng-template mcTdTemplate="name" let-user>
              <div class="user-cell">
                <div class="user-avatar">{{ getUserInitials(user.name) }}</div>
                <strong>{{ user.name }}</strong>
              </div>
            </ng-template>

            <ng-template mcTdTemplate="email" let-user>
              <i class="pi pi-envelope mr-2"></i>
              {{ user.email }}
            </ng-template>

            <ng-template mcTdTemplate="actions" let-user>
              <div class="action-buttons">
                <p-button 
                  icon="pi pi-eye" 
                  [rounded]="true" 
                  [text]="true"
                  severity="info"
                  (onClick)="viewUser(user)"
                  pTooltip="Ver detalles">
                </p-button>
                <p-button 
                  icon="pi pi-pencil" 
                  [rounded]="true" 
                  [text]="true"
                  severity="warn"
                  (onClick)="editUser(user)"
                  pTooltip="Editar">
                </p-button>
                <p-button 
                  icon="pi pi-trash" 
                  [rounded]="true" 
                  [text]="true"
                  severity="danger"
                  (onClick)="deleteUser(user)"
                  pTooltip="Eliminar">
                </p-button>
              </div>
            </ng-template>
          </mc-table>

          @if (lastAction()) {
            <div class="action-feedback">
              <i class="pi pi-info-circle"></i>
              {{ lastAction() }}
            </div>
          }
        </p-card>

        <div class="code-section">
          <h4>Código TypeScript</h4>
          <pre><code class="language-typescript">{{actionsTableCode}}</code></pre>
          
          <h4>Código HTML</h4>
          <pre><code class="language-html">{{actionsTableTemplate}}</code></pre>
        </div>
      </section>

      <!-- Ejemplo 4: Tabla con Datos Complejos -->
      <section class="example-section">
        <h2>4. Tabla con Formato de Moneda y Rating</h2>
        <p class="description">
          Ejemplo con datos de productos mostrando precios formateados y ratings con estrellas.
        </p>
        
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <h3>Ejemplo en Vivo</h3>
            </div>
          </ng-template>
          
          <mc-table 
            [columns]="productsColumns" 
            [response]="productsResponse()">
            
            <ng-template mcTdTemplate="name" let-product>
              <strong>{{ product.name }}</strong>
            </ng-template>

            <ng-template mcTdTemplate="price" let-product>
              <span class="price">{{ formatPrice(product.price) }}</span>
            </ng-template>

            <ng-template mcTdTemplate="stock" let-product>
              <span [class.low-stock]="product.stock < 10">
                {{ product.stock }} unidades
              </span>
            </ng-template>

            <ng-template mcTdTemplate="rating" let-product>
              <div class="rating">
                @for (star of [1,2,3,4,5]; track star) {
                  <i 
                    class="pi" 
                    [class.pi-star-fill]="star <= product.rating"
                    [class.pi-star]="star > product.rating">
                  </i>
                }
                <span class="rating-value">({{ product.rating }})</span>
              </div>
            </ng-template>
          </mc-table>
        </p-card>

        <div class="code-section">
          <h4>Código TypeScript</h4>
          <pre><code class="language-typescript">{{productsTableCode}}</code></pre>
          
          <h4>Código HTML</h4>
          <pre><code class="language-html">{{productsTableTemplate}}</code></pre>
        </div>
      </section>

      <!-- Ejemplo 5: Estructura de Datos MCListResponse -->
      <section class="example-section">
        <h2>5. Estructura MCListResponse</h2>
        <p class="description">
          MC-Table usa el tipo <code>MCListResponse</code> para recibir los datos. 
          Esta estructura permite paginación y metadata adicional.
        </p>
        
        <div class="code-section">
          <h4>Definición TypeScript</h4>
          <pre><code class="language-typescript">{{mcListResponseCode}}</code></pre>
          
          <h4>Ejemplo de Conversión desde Array Simple</h4>
          <pre><code class="language-typescript">{{conversionCode}}</code></pre>
        </div>
      </section>

      <!-- Ejemplo 6: Configuración de Columnas -->
      <section class="example-section">
        <h2>6. Configuración de Columnas (MCColumn)</h2>
        <p class="description">
          Las columnas se definen usando la interfaz <code>MCColumn</code>.
        </p>
        
        <div class="code-section">
          <h4>Definición TypeScript</h4>
          <pre><code class="language-typescript">{{mcColumnCode}}</code></pre>
          
          <h4>Ejemplos de Configuración</h4>
          <pre><code class="language-typescript">{{columnExamplesCode}}</code></pre>
        </div>
      </section>

      <!-- Tips y Best Practices -->
      <section class="example-section tips-section">
        <h2><i class="pi pi-lightbulb"></i> Tips y Mejores Prácticas</h2>
        
        <div class="tips-grid">
          <div class="tip-card">
            <h4><i class="pi pi-check-circle"></i> Usa Computed Signals</h4>
            <p>Para transformar tus arrays a MCListResponse, usa computed signals de Angular para reactividad automática.</p>
            <pre><code class="language-typescript">{{tip1Code}}</code></pre>
          </div>

          <div class="tip-card">
            <h4><i class="pi pi-check-circle"></i> Templates Reutilizables</h4>
            <p>Crea templates reutilizables para datos que se repiten en múltiples tablas.</p>
            <pre><code class="language-typescript">{{tip2Code}}</code></pre>
          </div>

          <div class="tip-card">
            <h4><i class="pi pi-check-circle"></i> Nombres de Fields</h4>
            <p>El campo 'field' en MCColumn puede usar dot notation para propiedades anidadas.</p>
            <pre><code class="language-typescript">{{tip3Code}}</code></pre>
          </div>

          <div class="tip-card">
            <h4><i class="pi pi-check-circle"></i> Imports Necesarios</h4>
            <p>Asegúrate de importar todos los módulos necesarios.</p>
            <pre><code class="language-typescript">{{importsCode}}</code></pre>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .storybook-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    .storybook-header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #74ACDF 0%, #0033A0 100%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .storybook-header h1 {
      margin: 0 0 1rem 0;
      font-size: 2.5rem;
      font-weight: 600;
    }

    .storybook-header h1 i {
      margin-right: 1rem;
    }

    .storybook-header p {
      margin: 0;
      font-size: 1.2rem;
      opacity: 0.95;
    }

    .example-section {
      margin-bottom: 4rem;
    }

    .example-section h2 {
      color: #0033A0;
      font-size: 1.8rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #74ACDF;
    }

    .description {
      color: #666;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .description code {
      background: #f4f4f4;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      color: #e91e63;
      font-size: 0.9rem;
    }

    .card-header {
      padding: 1rem;
      background: #f8f9fa;
    }

    .card-header h3 {
      margin: 0;
      color: #0033A0;
      font-size: 1.2rem;
    }

    .code-section {
      margin-top: 2rem;
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #74ACDF;
    }

    .code-section h4 {
      color: #0033A0;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .code-section h4:first-child {
      margin-top: 0;
    }

    .code-section pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 0.5rem 0;
    }

    .code-section code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    /* User cell styles */
    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #74ACDF, #0033A0);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
    }

    /* Action buttons */
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-feedback {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      color: #1976d2;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Price formatting */
    .price {
      font-weight: 600;
      color: #4caf50;
      font-size: 1.1rem;
    }

    .low-stock {
      color: #f44336;
      font-weight: 600;
    }

    /* Rating stars */
    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .rating i {
      color: #ffc107;
      font-size: 1rem;
    }

    .rating .rating-value {
      margin-left: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    /* Tips section */
    .tips-section {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .tips-section h2 {
      color: #e65100;
      border-bottom-color: #ff9800;
    }

    .tips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .tip-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .tip-card h4 {
      color: #ff9800;
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tip-card p {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .tip-card pre {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 0;
    }

    .tip-card code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.85rem;
      line-height: 1.4;
      color: #f8f8f2;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .storybook-container {
        padding: 1rem;
      }

      .storybook-header h1 {
        font-size: 1.8rem;
      }

      .example-section h2 {
        font-size: 1.4rem;
      }

      .tips-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class McTableDemoComponent {
  // ============================================
  // DATOS DE EJEMPLO
  // ============================================
  
  private users = signal<User[]>([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: new Date('2024-02-20')
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos.lopez@example.com',
      role: 'Viewer',
      status: 'inactive',
      createdAt: new Date('2024-03-10')
    },
    {
      id: 4,
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      role: 'Editor',
      status: 'pending',
      createdAt: new Date('2024-04-05')
    },
  ]);

  private products = signal<Product[]>([
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Electrónicos', price: 1299.99, stock: 15, rating: 4.5 },
    { id: 2, name: 'iPhone 15 Pro', category: 'Smartphones', price: 999.99, stock: 8, rating: 5 },
    { id: 3, name: 'Silla Ergonómica', category: 'Muebles', price: 249.99, stock: 25, rating: 4 },
    { id: 4, name: 'Teclado Mecánico RGB', category: 'Accesorios', price: 89.99, stock: 45, rating: 4.5 },
    { id: 5, name: 'Monitor 4K 27"', category: 'Electrónicos', price: 399.99, stock: 5, rating: 4 },
  ]);

  lastAction = signal<string>('');

  // ============================================
  // CONFIGURACIÓN DE COLUMNAS
  // ============================================

  // Tabla simple
  simpleColumns: MCColumn[] = [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Nombre' },
    { field: 'email', title: 'Email' },
    { field: 'role', title: 'Rol' },
  ];

  // Tabla con templates personalizados
  customColumns: MCColumn[] = [
    { field: 'name', title: 'Nombre' },
    { field: 'email', title: 'Email' },
    { field: 'role', title: 'Rol' },
    { field: 'status', title: 'Estado' },
  ];

  // Tabla con acciones
  actionsColumns: MCColumn[] = [
    { field: 'name', title: 'Usuario' },
    { field: 'email', title: 'Email' },
    { field: 'role', title: 'Rol' },
    { field: 'actions', title: 'Acciones' },
  ];

  // Tabla de productos
  productsColumns: MCColumn[] = [
    { field: 'name', title: 'Producto' },
    { field: 'category', title: 'Categoría' },
    { field: 'price', title: 'Precio' },
    { field: 'stock', title: 'Stock' },
    { field: 'rating', title: 'Rating' },
  ];

  // ============================================
  // COMPUTED SIGNALS - Conversión a MCListResponse
  // ============================================

  usersResponse = computed<MCListResponse<User>>(() => ({
    data: this.users(),
    total: this.users().length,
    current_page: 1,
    per_page: 10,
  }));

  productsResponse = computed<MCListResponse<Product>>(() => ({
    data: this.products(),
    total: this.products().length,
    current_page: 1,
    per_page: 10,
  }));

  // ============================================
  // MÉTODOS HELPER
  // ============================================

  getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' {
    const severities: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'Admin': 'danger',
      'Editor': 'info',
      'Viewer': 'success'
    };
    return severities[role] || 'info';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'pending': 'Pendiente'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    const severities: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'active': 'success',
      'inactive': 'danger',
      'pending': 'warn'
    };
    return severities[status] || 'info';
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  // Acciones
  viewUser(user: User): void {
    this.lastAction.set(`Ver detalles de: ${user.name}`);
    setTimeout(() => this.lastAction.set(''), 3000);
  }

  editUser(user: User): void {
    this.lastAction.set(`Editar usuario: ${user.name}`);
    setTimeout(() => this.lastAction.set(''), 3000);
  }

  deleteUser(user: User): void {
    this.lastAction.set(`Eliminar usuario: ${user.name}`);
    setTimeout(() => this.lastAction.set(''), 3000);
  }

  // ============================================
  // CÓDIGO PARA MOSTRAR EN LA DOCUMENTACIÓN
  // ============================================

  simpleTableCode = `// Definir columnas
simpleColumns: MCColumn[] = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Nombre' },
  { field: 'email', title: 'Email' },
  { field: 'role', title: 'Rol' },
];

// Convertir datos a MCListResponse
usersResponse = computed<MCListResponse<User>>(() => ({
  data: this.users(),
  total: this.users().length,
}));`;

  simpleTableTemplate = `<mc-table 
  [columns]="simpleColumns" 
  [response]="usersResponse()">
</mc-table>`;

  customTableCode = `// Columnas
customColumns: MCColumn[] = [
  { field: 'name', title: 'Nombre' },
  { field: 'email', title: 'Email' },
  { field: 'role', title: 'Rol' },
  { field: 'status', title: 'Estado' },
];

// Métodos helper
getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' {
  const severities = {
    'Admin': 'danger',
    'Editor': 'info',
    'Viewer': 'success'
  };
  return severities[role] || 'info';
}

getStatusLabel(status: string): string {
  const labels = {
    'active': 'Activo',
    'inactive': 'Inactivo',
    'pending': 'Pendiente'
  };
  return labels[status] || status;
}`;

  customTableTemplate = `<mc-table [columns]="customColumns" [response]="usersResponse()">
  <!-- Email con icono -->
  <ng-template mcTdTemplate="email" let-user>
    <i class="pi pi-envelope mr-2"></i>
    <a [href]="'mailto:' + user.email">{{ user.email }}</a>
  </ng-template>

  <!-- Rol con badge -->
  <ng-template mcTdTemplate="role" let-user>
    <p-tag 
      [value]="user.role" 
      [severity]="getRoleSeverity(user.role)">
    </p-tag>
  </ng-template>

  <!-- Estado con badge -->
  <ng-template mcTdTemplate="status" let-user>
    <p-tag 
      [value]="getStatusLabel(user.status)" 
      [severity]="getStatusSeverity(user.status)">
    </p-tag>
  </ng-template>
</mc-table>`;

  actionsTableCode = `actionsColumns: MCColumn[] = [
  { field: 'name', title: 'Usuario' },
  { field: 'email', title: 'Email' },
  { field: 'role', title: 'Rol' },
  { field: 'actions', title: 'Acciones' },
];

viewUser(user: User): void {
  console.log('Ver detalles de:', user);
}

editUser(user: User): void {
  console.log('Editar:', user);
}

deleteUser(user: User): void {
  console.log('Eliminar:', user);
}`;

  actionsTableTemplate = `<mc-table [columns]="actionsColumns" [response]="usersResponse()">
  <ng-template mcTdTemplate="actions" let-user>
    <div class="action-buttons">
      <p-button 
        icon="pi pi-eye" 
        [rounded]="true" 
        [text]="true"
        severity="info"
        (onClick)="viewUser(user)"
        pTooltip="Ver detalles">
      </p-button>
      <p-button 
        icon="pi pi-pencil" 
        [rounded]="true" 
        [text]="true"
        severity="warn"
        (onClick)="editUser(user)"
        pTooltip="Editar">
      </p-button>
      <p-button 
        icon="pi pi-trash" 
        [rounded]="true" 
        [text]="true"
        severity="danger"
        (onClick)="deleteUser(user)"
        pTooltip="Eliminar">
      </p-button>
    </div>
  </ng-template>
</mc-table>`;

  productsTableCode = `productsColumns: MCColumn[] = [
  { field: 'name', title: 'Producto' },
  { field: 'category', title: 'Categoría' },
  { field: 'price', title: 'Precio' },
  { field: 'stock', title: 'Stock' },
  { field: 'rating', title: 'Rating' },
];

formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}`;

  productsTableTemplate = `<mc-table [columns]="productsColumns" [response]="productsResponse()">
  <ng-template mcTdTemplate="price" let-product>
    <span class="price">{{ formatPrice(product.price) }}</span>
  </ng-template>

  <ng-template mcTdTemplate="stock" let-product>
    <span [class.low-stock]="product.stock < 10">
      {{ product.stock }} unidades
    </span>
  </ng-template>

  <ng-template mcTdTemplate="rating" let-product>
    <div class="rating">
      @for (star of [1,2,3,4,5]; track star) {
        <i 
          class="pi" 
          [class.pi-star-fill]="star <= product.rating"
          [class.pi-star]="star > product.rating">
        </i>
      }
      <span>({{ product.rating }})</span>
    </div>
  </ng-template>
</mc-table>`;

  mcListResponseCode = `export interface MCListResponse<T> {
  current_page?: number;  // Página actual
  data: T[];              // Array de datos ✅ REQUERIDO
  total?: number;         // Total de registros
  from?: number;          // Índice del primer registro
  last_page?: number;     // Última página
  to?: number;            // Índice del último registro
  per_page?: number;      // Registros por página
}`;

  conversionCode = `// Si tienes un array simple
private users = signal<User[]>([...]);

// Conviértelo a MCListResponse con computed signal
usersResponse = computed<MCListResponse<User>>(() => ({
  data: this.users(),              // ✅ Requerido
  total: this.users().length,      // Opcional pero recomendado
  current_page: 1,                 // Opcional
  per_page: 10,                    // Opcional
}));

// Usa el computed signal en el template
<mc-table [response]="usersResponse()" ...>`;

  mcColumnCode = `export interface MCColumn {
  field: string;           // Nombre del campo ✅ REQUERIDO
  title: string;           // Título de la columna ✅ REQUERIDO
  isShow?: boolean;        // Mostrar/ocultar columna (default: true)
  isSortable?: boolean;    // Columna ordenable
  isSortDefault?: boolean; // Ordenar por defecto
  isSortDescDefault?: boolean; // Orden descendente por defecto
}`;

  columnExamplesCode = `// Ejemplo básico
columns: MCColumn[] = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Nombre' },
];

// Con propiedades anidadas (dot notation)
columns: MCColumn[] = [
  { field: 'user.name', title: 'Usuario' },
  { field: 'user.email', title: 'Email' },
  { field: 'address.city', title: 'Ciudad' },
];

// Con ordenamiento
columns: MCColumn[] = [
  { 
    field: 'createdAt', 
    title: 'Fecha',
    isSortable: true,
    isSortDefault: true,
    isSortDescDefault: true 
  },
];`;

  tip1Code = `// ✅ CORRECTO: Usa computed signals
usersResponse = computed<MCListResponse<User>>(() => ({
  data: this.users(),
  total: this.users().length,
}));

// ❌ INCORRECTO: No usar signals normales
usersResponse = signal<MCListResponse<User>>({
  data: this.users(),  // No reactivo
  total: 0
});`;

  tip2Code = `// Template reutilizable para estado
<ng-template #statusTemplate let-item>
  <p-tag 
    [value]="getStatusLabel(item.status)" 
    [severity]="getStatusSeverity(item.status)">
  </p-tag>
</ng-template>

// Usar en múltiples tablas
<mc-table ...>
  <ng-template mcTdTemplate="status" let-user>
    <ng-container 
      [ngTemplateOutlet]="statusTemplate" 
      [ngTemplateOutletContext]="{$implicit: user}">
    </ng-container>
  </ng-template>
</mc-table>`;

  tip3Code = `// ✅ Propiedades simples
{ field: 'name', title: 'Nombre' }

// ✅ Propiedades anidadas (dot notation)
{ field: 'user.name', title: 'Usuario' }
{ field: 'address.city', title: 'Ciudad' }
{ field: 'company.address.country', title: 'País' }

// En el template, accede al objeto completo
<ng-template mcTdTemplate="user.name" let-item>
  {{ item.user?.name || 'N/A' }}
</ng-template>`;

  importsCode = `import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// MC-Kit
import { MCTable, MCTdTemplateDirective } from '@mckit/table';
import { MCColumn, MCListResponse } from '@mckit/core';

// PrimeNG (opcional, para templates personalizados)
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MCTable,
    MCTdTemplateDirective,
    ButtonModule,  // Si usas p-button
    TagModule,     // Si usas p-tag
  ],
  // ...
})`;
}
