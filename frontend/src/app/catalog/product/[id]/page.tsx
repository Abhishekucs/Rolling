interface ProductProps {
  params: { id: string };
}

export default function Product({ params }: ProductProps): JSX.Element {
  return <div>id is {params.id}</div>;
}
