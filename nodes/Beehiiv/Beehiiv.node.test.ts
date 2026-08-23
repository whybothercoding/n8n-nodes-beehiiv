import { INodeProperties } from 'n8n-workflow';
import { Beehiiv } from './Beehiiv.node';

const EXPECTED_RESOURCES = [
	'automation',
	'customField',
	'post',
	'publication',
	'referralProgram',
	'segment',
	'subscription',
	'tier',
	'webhook',
];

describe('Beehiiv node description', () => {
	const node = new Beehiiv();
	const { properties } = node.description;

	it('lists every resource exactly once, alphabetically', () => {
		const resourceProperty = properties.find((p) => p.name === 'resource') as INodeProperties;
		const values = (resourceProperty.options as Array<{ value: string }>).map((o) => o.value);

		expect(new Set(values).size).toBe(values.length);
		expect(values.sort()).toEqual(EXPECTED_RESOURCES.slice().sort());
	});

	it("gives every resource's operation selector a default that is one of its own options", () => {
		for (const resource of EXPECTED_RESOURCES) {
			const operationProperty = properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions?.show?.resource as string[] | undefined)?.includes(resource),
			);
			expect(operationProperty).toBeDefined();

			const values = (operationProperty!.options as Array<{ value: string }>).map((o) => o.value);
			expect(values).toContain(operationProperty!.default);
		}
	});

	it('references only parameter names that are actually declared', () => {
		const declaredNames = new Set(properties.map((p) => p.name));
		// Parameters that exist implicitly (n8n built-ins) or are read via getNodeParameter
		// inside shared preSend/pagination functions rather than a routing expression.
		const implicit = new Set(['returnAll', 'limit']);

		const serialized = JSON.stringify(properties);
		const references = serialized.matchAll(/\$parameter\["([^"]+)"\]/g);

		const missing = new Set<string>();
		for (const [, name] of references) {
			if (!declaredNames.has(name) && !implicit.has(name)) {
				missing.add(name);
			}
		}

		expect([...missing]).toEqual([]);
	});

	it('gives every operation option a routing.request with a method and url', () => {
		const problems: string[] = [];

		for (const property of properties) {
			if (property.name !== 'operation' || !Array.isArray(property.options)) continue;
			for (const option of property.options as unknown as Array<Record<string, unknown>>) {
				const routing = option.routing as { request?: { method?: string; url?: string } } | undefined;
				if (!routing?.request?.method || !routing.request.url) {
					problems.push(`${String(option.value)} (${property.displayOptions?.show?.resource})`);
				}
			}
		}

		expect(problems).toEqual([]);
	});

	it('is usable as an AI Agent tool', () => {
		expect(node.description.usableAsTool).toBe(true);
	});
});
