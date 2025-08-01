export default function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th className="p-2 border-b border-b-grey-500" colSpan={2}>
        {category}
      </th>
    </tr>
  );
}
