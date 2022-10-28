export interface IBaseRepository<T> {
  save(t: T): Promise<T>;
  update(t: T, entity: unknown): Promise<T>;
}
