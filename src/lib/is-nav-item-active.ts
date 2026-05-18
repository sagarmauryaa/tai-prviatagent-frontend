type Matcher = {
	type: 'startsWith' | 'equals';
	href: string;
};

export function isNavItemActive({ disabled, external, href, matcher, pathname }: {
	disabled?: boolean;
	external?: boolean;
	href?: string;
	matcher?: Matcher;
	pathname: string;
}) {
	if (disabled || !href || external) {
		return false;
	}

	if (matcher) {
		if (matcher.type === "startsWith") {
			return pathname.startsWith(matcher.href);
		}

		if (matcher.type === "equals") {
			return pathname === matcher.href;
		}

		return false;
	}

	return pathname === href;
}
