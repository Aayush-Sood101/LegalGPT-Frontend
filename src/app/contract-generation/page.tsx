"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label2";
import { Input } from "@/components/ui/input2";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function ContractGeneratorForm() {
  // Contract types array
  const contractTypes = [
    "nda", "contractor", "sla", "partnership",
    "sales", "employment", "lease", "mou", "noncompete"
  ];

  // State variables
  const [contractType, setContractType] = useState<string>(contractTypes[0]);
  const [partyA, setPartyA] = useState<string>('');
  const [partyB, setPartyB] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [clauseQuery, setClauseQuery] = useState<string>('');
  const [jurisdiction, setJurisdiction] = useState<string>('New Delhi');
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [goodsDescription, setGoodsDescription] = useState<string>('');
  const [scope, setScope] = useState<string>('');
  const [contractText, setContractText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
  
    const payload: Record<string, string> = {
      contract_type: contractType,
      party_a: partyA,
      party_b: partyB,
      duration: duration,
      clause_query: clauseQuery,
      jurisdiction: jurisdiction
    };
  
    // Change this in the handleSubmit function
try {
  const response = await fetch("/api/proxy/generate", {  // Use your proxy endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  // Add this after the fetch call in handleSubmit
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate contract");
  }

  const data = await response.json();
  setContractText(data.contract || data.text || JSON.stringify(data));
  setSuccess(true);

  // Rest of your code remains the same
} catch (err) {
  setError(err instanceof Error ? err.message : "Failed to generate contract");
} finally {
  setIsLoading(false);
}


  };

  return (
    <div className="shadow-input mx-auto w-full max-w-3xl rounded-none bg-white p-6 md:rounded-2xl md:p-10 dark:bg-black">

      <h2 className="text-5xl font-bold text-neutral-800 dark:text-neutral-200">
        Contract Generator
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Fill the form to generate a legally formatted, Indian-law compliant contract.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="contract-type">Contract Type</Label>
          <select 
            id="contract-type"
            value={contractType} 
            onChange={(e) => setContractType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {contractTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="party-a">Party A</Label>
          <Input 
            id="party-a"
            value={partyA} 
            onChange={(e) => setPartyA(e.target.value)} 
            placeholder="Enter name of first party"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="party-b">Party B</Label>
          <Input 
            id="party-b"
            value={partyB} 
            onChange={(e) => setPartyB(e.target.value)} 
            placeholder="Enter name of second party"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="duration">Duration</Label>
          <Input 
            id="duration"
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            placeholder="e.g., '12 months', '2 years'"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="clause-topic">Clause Topic</Label>
          <Input 
            id="clause-topic"
            value={clauseQuery} 
            onChange={(e) => setClauseQuery(e.target.value)} 
            placeholder="e.g., Confidentiality, Termination"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="jurisdiction">Jurisdiction</Label>
          <Input 
            id="jurisdiction"
            value={jurisdiction} 
            onChange={(e) => setJurisdiction(e.target.value)} 
          />
        </LabelInputContainer>

        {contractType === "lease" && (
          <LabelInputContainer className="mb-4">
            <Label htmlFor="property-address">Property Address</Label>
            <Input 
              id="property-address"
              value={propertyAddress} 
              onChange={(e) => setPropertyAddress(e.target.value)} 
              placeholder="Enter property address"
            />
          </LabelInputContainer>
        )}

        {contractType === "employment" && (
          <LabelInputContainer className="mb-4">
            <Label htmlFor="position">Position Title</Label>
            <Input 
              id="position"
              value={position} 
              onChange={(e) => setPosition(e.target.value)} 
              placeholder="Enter job position"
            />
          </LabelInputContainer>
        )}

        {contractType === "sales" && (
          <LabelInputContainer className="mb-4">
            <Label htmlFor="goods-description">Goods or Services Description</Label>
            <Input 
              id="goods-description"
              value={goodsDescription} 
              onChange={(e) => setGoodsDescription(e.target.value)} 
              placeholder="Describe goods or services"
            />
          </LabelInputContainer>
        )}

        {contractType === "noncompete" && (
          <LabelInputContainer className="mb-4">
            <Label htmlFor="scope">Scope of Restriction</Label>
            <Input 
              id="scope"
              value={scope} 
              onChange={(e) => setScope(e.target.value)} 
              placeholder="Enter scope of restriction"
            />
          </LabelInputContainer>
        )}

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
              Generating...
            </>
          ) : (
            "Generate Contract"
          )}
          <BottomGradient />
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">📜 Contract Content</h3>
          <Textarea 
            value={contractText} 
            readOnly 
            rows={15}
            className="w-full font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
