import type { Product } from "../../interfaces/product.interface";

export const ProductSpecifications = ({
  specifications,
}: {
  specifications: Product["specifications"];
}) =>
  specifications.length ? (
    <section className="productSection">
      <h2>Specifications</h2>
      <div className="tableScroll">
        <table className="publicSpecifications">
          <tbody>
            {specifications.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.specificationName}</th>
                <td>{item.specificationValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  ) : null;
