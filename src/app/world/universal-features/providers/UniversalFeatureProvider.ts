import UniversalFeatureCollection from "../UniversalFeatureCollection";

export default abstract class UniversalFeatureProvider {
	public abstract getCollection(
		{
			x,
			y
		}: {
			x: number;
			y: number;
		}
	): Promise<UniversalFeatureCollection>;
}