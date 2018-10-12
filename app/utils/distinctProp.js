import { pluck, distinctUntilChanged } from "rxjs/operators";
import { Observable } from "rxjs";

export default (...path: any[]) => (src$: Observable<any>): Observable<any> => src$.pipe(
  pluck(...path),
  distinctUntilChanged()
);