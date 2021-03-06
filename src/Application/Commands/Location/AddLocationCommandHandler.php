<?php

namespace AmeliaBooking\Application\Commands\Location;

use AmeliaBooking\Application\Common\Exceptions\AccessDeniedException;
use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Entity\Location\Location;
use AmeliaBooking\Domain\Entity\User\Provider;
use AmeliaBooking\Domain\Factory\Location\LocationFactory;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Domain\ValueObjects\String\Slug;
use AmeliaBooking\Domain\Factory\Location\ProviderLocationFactory;
use AmeliaBooking\Domain\ValueObjects\String\Status;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Infrastructure\Repository\Location\ProviderLocationRepository;
use AmeliaBooking\Infrastructure\Repository\User\ProviderRepository;
use AmeliaBooking\Application\Services\Helper\HelperService;

/**
 * Class AddLocationCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Location
 */
class AddLocationCommandHandler extends CommandHandler
{

    /**
     * @var array
     */
    public $mandatoryFields = [
        'name',
        'address',
        'phone',
        'latitude',
        'longitude'
    ];

    /**
     * @param AddLocationCommand $command
     *
     * @return CommandResult
     * @throws \Slim\Exception\ContainerValueNotFoundException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     * @throws AccessDeniedException
     * @throws \Interop\Container\Exception\ContainerException
     */
    public function handle(AddLocationCommand $command)
    {
        if (!$this->getContainer()->getPermissionsService()->currentUserCanWrite(Entities::LOCATIONS)) {
            throw new AccessDeniedException('You are not allowed to add location');
        }

        $result = new CommandResult();

        $this->checkMandatoryFields($command);

        $location = LocationFactory::create($command->getFields());
        if (!$location instanceof Location) {
            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setMessage('Could not create a new location.');

            return $result;
        }

        // create location slug from name
        $slug = sanitize_title($location->getName()->getValue());
        $slug = substr($slug, 0, Slug::MAX_LENGTH);

        /** @var LocationRepository $locationRepository */
        $locationRepository = $this->container->get('domain.locations.repository');

        $locationRepository->beginTransaction();

        $existingLocations = $locationRepository->getAll();

        $allLocationsAreHidden = true;

        /** @var Location $existingLocation */
        foreach ($existingLocations->getItems() as $existingLocation) {
          if ($slug === $existingLocation->getSlug()->getValue()) {
            $slug = "{$slug}02"; 
          }
          if ($existingLocation === Status::VISIBLE) {
              $allLocationsAreHidden = false;
          }
        }

        $location->setSlug(new Slug($slug));

        if ($locationId = $locationRepository->add($location)) {
            if ($allLocationsAreHidden) {
                /** @var ProviderRepository $providerRepository */
                $providerRepository = $this->container->get('domain.users.providers.repository');

                /** @var ProviderLocationRepository $providerLocationRepo */
                $providerLocationRepo = $this->container->get('domain.bookable.service.providerLocation.repository');

                /** @var Collection $providers */
                $providers = $providerRepository->getAll();

                /** @var Provider $provider */
                foreach ($providers->getItems() as $provider) {
                    if (!$provider->getLocationId()) {
                        $providerLocation = ProviderLocationFactory::create([
                            'userId'     => $provider->getId()->getValue(),
                            'locationId' => $locationId
                        ]);

                        $providerLocationRepo->add($providerLocation);
                    }
                }
            }

            $result->setResult(CommandResult::RESULT_SUCCESS);
            $result->setMessage('Successfully added location.');
            $result->setData([
                Entities::LOCATION => $location->toArray()
            ]);

            $locationRepository->commit();

            /** @var HelperService $helperService */
            $helperService = $this->container->get('application.helper.service');
            $helperService->cleanCustomTemplatesCache();            
        }

        return $result;
    }
}
