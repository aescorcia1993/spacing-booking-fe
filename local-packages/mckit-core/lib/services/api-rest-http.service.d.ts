import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MCListResponse } from '../entities/mc-list-response';
export declare abstract class MCApiRestHttpService<T extends {
    id?: any;
}> {
    http: HttpClient;
    /**
     * Assign path model to use in the service
     */
    pathModel: string;
    /**
     * Assign base url to use in the service
     */
    baseUrl: string;
    create(item: T): Observable<T>;
    update(item: T): Observable<T>;
    list(queryParams?: string): Observable<MCListResponse<T>>;
    get(id: any): Observable<T>;
    delete(id: any): Observable<void>;
}
