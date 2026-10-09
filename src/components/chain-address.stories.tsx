import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChainAddress } from "./chain-address";
import { KeyValueList } from "./key-value-list";

// Direcciones con forma real pero inventadas; el host del explorador es un dominio de ejemplo.
const account = "GDN3CAQ7XK2LJ5WZTPH4MVY6RBE3UOF2ISN7DGA5KXCLW2QPZTHV4SB6";
const contract = "CBQ5ZTVHTZPQ2WLCXK5AGD7NSI2FOU3EBR6YVM4HPTZW5JL2KX7QM7KD";
const txHash = "7506466e271ffe2576fe577888eba846e8db514716d682e5726d81c3e274bedf";
const explorer = "https://explorer.example";

const meta = {
  title: "Componentes/Estado/ChainAddress",
  component: ChainAddress,
  args: { value: account, label: "Cuenta de la bodega" },
} satisfies Meta<typeof ChainAddress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Cuenta: Story = { args: { explorerUrl: `${explorer}/account/${account}` } };

export const Contrato: Story = {
  args: {
    value: contract,
    label: "Contrato NFT",
    explorerUrl: `${explorer}/contract/${contract}`,
  },
};

export const HashDeTransaccion: Story = {
  args: { value: txHash, label: "Transacción", explorerUrl: `${explorer}/tx/${txHash}` },
};

/** Sin truncar: la dirección entera, que parte de línea en anchos estrechos. */
export const Completa: Story = {
  args: { truncate: false },
  decorators: [(Story) => <div className="max-w-xs">{Story()}</div>],
};

export const SinCopiar: Story = { args: { copyable: false } };

export const Pequena: Story = {
  args: { size: "sm", head: 4, tail: 4, explorerUrl: `${explorer}/account/${account}` },
};

function Sheet() {
  return (
    <div className="max-w-md">
      <KeyValueList
        items={[
          {
            term: "Cuenta",
            value: (
              <ChainAddress
                value={account}
                label="Cuenta de la bodega"
                explorerUrl={`${explorer}/account/${account}`}
              />
            ),
          },
          {
            term: "Contrato",
            value: (
              <ChainAddress
                value={contract}
                label="Contrato NFT"
                explorerUrl={`${explorer}/contract/${contract}`}
              />
            ),
          },
          {
            term: "Última transacción",
            value: (
              <ChainAddress
                value={txHash}
                label="Transacción"
                explorerUrl={`${explorer}/tx/${txHash}`}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

/** En la ficha «Cuenta de la bodega» del ERP, dentro de una lista de datos. */
export const EnFicha: Story = { render: () => <Sheet /> };

export const EnFichaCava: Story = { render: () => <Sheet />, globals: { theme: "cava" } };
